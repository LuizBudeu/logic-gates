const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");

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
app.get("/savedGatesAndLoadLogic", (request, response) => {
    let savedGates = require("./saveData/savedGates.json");
    // savedGates = savedGates.filter((savedGate) => !savedGate.hidden);

    // Sort saved gates by order
    savedGates.sort((a, b) => {
        return a.order - b.order;
    });

    let accumulatedCode = "";
    const logicFunctions = [];
    let funcStr = "";
    savedGates.forEach((savedGate, index) => {
        const logicFunction = require(`./saveData/${savedGate.path}`);

        accumulatedCode += logicFunction.toString() + "\n";
        funcStr = accumulatedCode + `new ${savedGate.name}()`;

        if (!savedGate.hidden) {
            logicFunctions.push({
                name: savedGate.name,
                logic: funcStr,
                order: savedGate.order,
                ios: savedGate.ios,
            });
        }
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

    function generateGate(circuitJSON, newGateName) {
        const components = circuitJSON.components;
        const connections = circuitJSON.connections;

        const globalOutputs = components.filter((component) => component.type === "output" && component.isGlobal);
        const globalInputs = components.filter((component) => component.type === "input" && component.isGlobal);
        const gates = components.filter((component) => component.type === "gate");

        // Write function name
        let logicFunctionString = `function ${newGateName} () {\n`;

        // Write instantiation of lastOutput
        logicFunctionString += "this.lastOutput = {};\n";

        // Write compute function
        logicFunctionString += `this.compute = function (`;
        globalInputs.forEach((globalInput, index) => {
            logicFunctionString += `input${globalInput.IOId}`;
            if (index < globalInputs.length - 1) {
                logicFunctionString += ", ";
            }
        });
        logicFunctionString += ") {\n";

        // Write function's instantiation of gates
        gates.forEach((gate) => {
            const gateObjName = `${gate.name}${gate.circuitId}`;
            logicFunctionString += `if (this.${gateObjName} === undefined) {\nthis.${gateObjName} = new ${gate.name}();\n}\n`;
        });

        // Get return object
        const outputObj = {};
        globalOutputs.forEach((globalOutput) => {
            const outputName = `output${globalOutput.IOId}`;
            outputObj[outputName] = "";

            const upstreamConnection = connections.find((conn) => conn.downstream === globalOutput.circuitId);
            const upstreamComponent = getUpstreamComponent(upstreamConnection);

            outputObj[outputName] += getUpstreamLogic(upstreamComponent, upstreamConnection.upstream.split("_")[1]);
        });

        // Write output object
        logicFunctionString += "let output = {\n";
        Object.keys(outputObj).forEach((output, index) => {
            logicFunctionString += `${output}: ${outputObj[output]}`;
            if (index < Object.keys(outputObj).length - 1) {
                logicFunctionString += ",\n";
            }
        });
        logicFunctionString += "\n};";

        // Write lastOutput
        logicFunctionString += `\nthis.lastOutput = output;`;

        // Write return statement
        logicFunctionString += "\nreturn output;\n};\n}";

        return {
            logicFunctionString,
            ios: {
                inputs: globalInputs.length,
                outputs: globalOutputs.length,
            },
        };

        // Helper function to get upstreamCircuitId
        function getUpstreamComponent(upstreamConnection) {
            let upstreamCircuitId = upstreamConnection.upstream;
            if (upstreamConnection.upstream.includes("_")) {
                upstreamCircuitId = upstreamConnection.upstream.split("_")[0];
            }
            const upstreamComponent = components.find((component) => component.circuitId === upstreamCircuitId);
            return upstreamComponent;
        }

        // Recursively get the logic string for a component with memoization
        function getUpstreamLogic(upstreamComponent, outputIOId, memo = new Set()) {
            const memoKey = `${upstreamComponent.circuitId}_${outputIOId}`;

            // If the component has already been memoized, return the last output
            if (memo.has(memoKey)) {
                return `this.${upstreamComponent.name}${upstreamComponent.circuitId}.lastOutput?.${outputIOId}`;
            }

            memo.add(memoKey);

            let logicString = "";

            if (upstreamComponent.type === "input" && upstreamComponent.isGlobal) {
                logicString = `input${upstreamComponent.IOId}`;
            } else if (upstreamComponent.type === "gate") {
                logicString = `this.${upstreamComponent.name}${upstreamComponent.circuitId}.compute(`;

                const gateInputs = upstreamComponent.inputs;

                gateInputs.forEach((input, index) => {
                    const upstreamConnection = connections.find((conn) => conn.downstream === `${upstreamComponent.circuitId}_input${input.IOId}`);

                    const upComponent = getUpstreamComponent(upstreamConnection);

                    if (upComponent.type === "input" && upComponent.isGlobal) {
                        logicString += `input${upComponent.IOId}`;
                    } else if (upComponent.type === "gate") {
                        logicString += getUpstreamLogic(upComponent, upstreamConnection.upstream.split("_")[1], memo);
                    } else {
                        throw new Error("Invalid upstream component type");
                    }

                    if (index < gateInputs.length - 1) {
                        logicString += ", ";
                    }
                });

                logicString += `).${outputIOId}`;
            } else {
                throw new Error("Invalid upstream component type");
            }

            return logicString;
        }
    }

    // Generate full logic function string
    let logicFunctionString = "";

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

        logicFunctionString += `const ${savedGate.name} = require("./${savedGate.name}");\n`;
    });

    const newGate = generateGate(circuit, gateName);

    logicFunctionString += newGate.logicFunctionString;
    logicFunctionString += `\nmodule.exports = ${gateName};`;

    // Update savedGates file
    const newSavedGate = {
        name: gateName,
        path: `./logic/${gateName}.js`,
        order: savedGates.length,
        ios: newGate.ios,
        hidden: false,
    };
    savedGates.push(newSavedGate);

    fs.writeFileSync(path.join(__dirname, "/saveData/savedGates.json"), JSON.stringify(savedGates, null, 4));

    // Save gate to file
    fs.writeFileSync(path.join(__dirname, "/saveData/logic/" + gateName + ".js"), logicFunctionString);

    response.send(request.body);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
