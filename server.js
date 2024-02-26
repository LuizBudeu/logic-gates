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
        Status: "Running",
    };

    console.log("server status");

    response.send(JSON.stringify(status));
});

// Get saved gates from file
app.get("/savedGates", (request, response) => {
    console.log("getting saved gates ...");
    const savedGates = require("./saveData/savedGates.json");
    console.log("saved gates are ", savedGates);
    response.send(savedGates);
});

// Get all logic functions from files
app.get("/savedGatesAndLoadLogic", (request, response) => {
    let savedGates = require("./saveData/savedGates.json");

    // Sort saved gates by order
    savedGates.sort((a, b) => {
        return a.order - b.order;
    });

    let accumulatedCode = "";
    const logicFunctions = [];
    savedGates.forEach((savedGate, index) => {
        const logicFunction = require(`./saveData/${savedGate.path}`);

        accumulatedCode += logicFunction.toString() + "\n";

        logicFunctions.push({
            name: savedGate.name,
            logic: accumulatedCode,
            order: savedGate.order,
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
    }
    console.log("logic function is ", logicFunction.toString());

    response.send({
        name: request.params.name,
        logic: logicFunction.toString(),
    });
});

// Save circuit to gate file
app.post("/circuitToGate", (request, response) => {
    console.log("receiving data ...");
    console.log("body is ", request.body);

    const body = request.body;
    const gateName = body.gateName;
    const circuit = body.circuit;

    function generateLogicFunction(circuitJSON, newGateName) {
        const components = circuitJSON.components;
        const connections = circuitJSON.connections;

        const globalOutputs = components.filter((component) => component.type === "output" && component.isGlobal);
        const globalInputs = components.filter((component) => component.type === "input" && component.isGlobal);

        const outputObj = {};
        globalOutputs.forEach((globalOutput) => {
            const outputName = `output${globalOutput.IOId}`;
            outputObj[outputName] = "";

            const upstreamConnection = connections.find((conn) => conn.downstream === globalOutput.circuitId);
            const upstreamComponent = getUpstreamComponent(upstreamConnection);

            outputObj[outputName] += getUpstreamLogic(upstreamComponent, upstreamConnection.upstream.split("_")[1]);
        });

        let logicFunctionString = `function ${newGateName} (`;
        globalInputs.forEach((globalInput, index) => {
            logicFunctionString += `input${globalInput.IOId}`;
            if (index < globalInputs.length - 1) {
                logicFunctionString += ", ";
            }
        });
        logicFunctionString += ") {\n";
        logicFunctionString += "return {\n";
        Object.keys(outputObj).forEach((output, index) => {
            logicFunctionString += `${output}: ${outputObj[output]}`;
            if (index < Object.keys(outputObj).length - 1) {
                logicFunctionString += ",\n";
            }
        });
        logicFunctionString += "\n};\n}";

        return logicFunctionString;

        // Helper function to get upstreamCircuitId
        function getUpstreamComponent(upstreamConnection) {
            let upstreamCircuitId = upstreamConnection.upstream;
            if (upstreamConnection.upstream.includes("_")) {
                upstreamCircuitId = upstreamConnection.upstream.split("_")[0];
            }
            const upstreamComponent = components.find((component) => component.circuitId === upstreamCircuitId);
            return upstreamComponent;
        }

        // Recursive function to get the logic string for a component
        function getUpstreamLogic(upstreamComponent, outputIOId) {
            let logicString = "";

            if (upstreamComponent.type === "input" && upstreamComponent.isGlobal) {
                logicString = `input${upstreamComponent.IOId}`;
            } else if (upstreamComponent.type === "gate") {
                logicString = `${upstreamComponent.name}(`;

                const gateInputs = upstreamComponent.inputs;

                gateInputs.forEach((input, index) => {
                    const upstreamConnection = connections.find((conn) => conn.downstream === `${upstreamComponent.circuitId}_input${input.IOId}`);

                    const upComponent = getUpstreamComponent(upstreamConnection);

                    if (upComponent.type === "input" && upComponent.isGlobal) {
                        logicString += `input${upComponent.IOId}`;
                    } else if (upComponent.type === "gate") {
                        logicString += getUpstreamLogic(upComponent, upstreamConnection.upstream.split("_")[1]);
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

    const newGateLogicFunction = generateLogicFunction(circuit, gateName);

    logicFunctionString += newGateLogicFunction;
    logicFunctionString += `\nmodule.exports = ${gateName};`;

    // Update savedGates file
    const newGate = {
        name: gateName,
        path: `./logic/${gateName}.js`,
        order: savedGates.length,
    };
    savedGates.push(newGate);

    fs.writeFileSync(path.join(__dirname, "/saveData/savedGates.json"), JSON.stringify(savedGates, null, 4));

    // Save gate to file
    fs.writeFileSync(path.join(__dirname, "/saveData/logic/" + gateName + ".js"), logicFunctionString);

    response.send(request.body);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
