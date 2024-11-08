const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const generateLogicFunctionString = require("./generateLogicFunctionString");

let NandGate = {
    name: "NAND",
    logic: `function NAND() \{
        this.lastOutput = {};
        this.compute = function (input0, input1) {
            let output = {
                output0: !(input0 && input1),
            };
            this.lastOutput = output;
            return output;
        };
    }
    new NAND();`,
    order: 0,
    ios: {
        inputs: [
            { IOId: "0", IOlabel: "in0asasa" },
            { IOId: "1", IOlabel: "in1fsa" },
        ],
        outputs: [{ IOId: "0", label: "out0asasa" }],
    },
};

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Main route
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "/index.html"));
});

// Simple status route
app.get("/status", (request, response) => {
    const status = {
        status: "Running",
    };

    console.log("server status");

    response.send(JSON.stringify(status));
});

// Get saved gates from file
app.get("/savedGates", (request, response) => {
    console.log("getting saved gates ...");
    let savedGates = require("./saveData/savedGates.json");
    savedGates = savedGates.filter((savedGate) => !savedGate.hidden);
    savedGates = savedGates.map(({ hidden, ...savedGate }) => savedGate);
    console.log("saved gates are ", savedGates);
    response.send(savedGates);
});

// Get all logic functions from files
// app.get("/savedGatesAndLoadLogic", (request, response) => {
//     let savedGates = require("./saveData/savedGates.json");
//     // savedGates = savedGates.filter((savedGate) => !savedGate.hidden);

//     // Sort saved gates by order
//     savedGates.sort((a, b) => {
//         return a.order - b.order;
//     });

//     let accumulatedCode = "";
//     const logicFunctions = [];
//     let funcStr = "";
//     savedGates.forEach((savedGate, index) => {
//         const logicFunction = require(`./saveData/${savedGate.path}`);

//         accumulatedCode += logicFunction.toString() + "\n";
//         funcStr = accumulatedCode + `new ${savedGate.name}()`;

//         if (!savedGate.hidden) {
//             logicFunctions.push({
//                 name: savedGate.name,
//                 logic: funcStr,
//                 order: savedGate.order,
//                 ios: savedGate.ios,
//             });
//         }
//     });

//     response.send(logicFunctions);
// });

app.get("/savedGatesAndLoadLogic", (request, response) => {
    let savedGates = require("./saveData/savedGates.json");
    // savedGates = savedGates.filter((savedGate) => !savedGate.hidden);

    // Sort saved gates by order
    savedGates.sort((a, b) => {
        return a.order - b.order;
    });

    // Always has NAND gate
    let accumulatedCode = NandGate.logic + "\n";
    const logicFunctions = [NandGate];
    let funcStr = "";

    // For each saved gate, grab circuit JSON and generate logic function string
    savedGates.forEach((savedGate, index) => {
        if (savedGate.hidden) {
            return;
        }

        const circuit = require(`./saveData/circuits/${savedGate.name}.json`);
        const logicFunctionString = generateLogicFunctionString(circuit, savedGate.name);

        // Get global IO labels
        const globalIOs = circuit.components.filter((component) => component.isGlobal);
        const ios = {
            inputs: [],
            outputs: [],
        };
        const inputs = globalIOs.filter((io) => io.type === "input");
        inputs.forEach((input) => {
            ios.inputs.push({
                IOId: input.IOId,
                IOLabel: input.label,
            });
        });

        const outputs = globalIOs.filter((io) => io.type === "output");
        outputs.forEach((input) => {
            ios.outputs.push({
                IOId: input.IOId,
                IOLabel: input.label,
            });
        });

        accumulatedCode += logicFunctionString + "\n";

        funcStr = accumulatedCode + `new ${savedGate.name}()`;

        logicFunctions.push({
            id: savedGate.id,
            name: savedGate.name,
            logic: funcStr,
            order: savedGate.function_order,
            ios: ios,
        });
    });

    response.send(logicFunctions);
});

// Get logic function from file
app.get("/logic/:name", (request, response) => {
    console.log(`"getting logic function for ${request.params.name} ..."`);

    let logicFunction;
    try {
        logicFunction = require(`./saveData/logic/${request.params.name}.js`);
    } catch (e) {
        response.status(400);
        response.send({
            name: request.params.name,
            logic: null,
        });
        return;
    }
    console.log("logic function is ", logicFunction.toString());

    response.send({
        name: request.params.name,
        logic: logicFunction.toString(),
    });
});

app.delete("/gate/:name", (request, response) => {
    console.log(`Deleting gate ${request.params.name}...`);

    let savedGates = require("./saveData/savedGates.json");
    let savedGatesNames = savedGates.map((savedGate) => savedGate.name);

    if (!savedGatesNames.includes(request.params.name)) {
        response.status(400);
        response.send({
            error: true,
            message: `Could not find gate ${request.params.name} to delete`,
        });
        return;
    }

    const softDeletedGateIndex = savedGates.findIndex((savedGate) => savedGate.name === request.params.name);
    savedGates[softDeletedGateIndex].hidden = true;
    fs.writeFileSync(path.join(__dirname, "/saveData/savedGates.json"), JSON.stringify(savedGates, null, 4));

    console.log(`Deleted gate ${request.params.name}`);
    response.send({
        error: false,
        message: `Deleted gate ${request.params.name}`,
    });
});

// Save circuit to gate file
app.post("/circuitToGate", (request, response) => {
    console.log("receiving data ...");
    console.log("body is ", request.body);

    const body = request.body;
    const gateName = body.gateName;
    const circuit = typeof body.circuit == "object" ? body.circuit : JSON.parse(body.circuit);

    const savedGates = require("./saveData/savedGates.json");
    savedGates.forEach((savedGate) => {
        if (savedGate.name === gateName) {
            response.status(400);
            response.send({
                gateName,
                message: "Gate name already exists. Please choose a different name.",
            });

            throw new Error("Gate name already exists. Please choose a different name.");
        }
    });

    // Update savedGates file
    const newSavedGate = {
        name: gateName,
        order: savedGates.length,
        hidden: false,
    };
    savedGates.push(newSavedGate);

    fs.writeFileSync(path.join(__dirname, "/saveData/savedGates.json"), JSON.stringify(savedGates, null, 4));

    // Save circuit JSON
    fs.writeFileSync(path.join(__dirname, "/saveData/circuits/" + gateName + ".json"), JSON.stringify(circuit, null, 4));

    response.send(request.body);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
