const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");
const sqlite3 = require('sqlite3').verbose();

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
    
    //module.exports = NAND;
    new NAND();`,
    order: 0,
    ios: {
        inputs: 2,
        outputs: 1
    },
}

let db = new sqlite3.Database('./Nandesis.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the Nandesis.db SQlite database.');
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Main route
app.get("/home", (request, response) => {
    response.sendFile(path.join(__dirname, "/public/index.html"));
});

// Simple status route
app.get("/status", (request, response) => {
    const status = {
        status: "Running",
    };

    console.log("server status");

    response.send(JSON.stringify(status));
});

// login page route
app.get("/login", (request, response) => {
    response.sendFile(path.join(__dirname, "/login.html"));
});

// login route
app.post("/login", (request, response) => {
    console.log("login");
    const body = request.body;
    let email = body.email;
    let password = body.password;

    db.get(`select id from user
        where email = ? and password = ?`, [email, password], 
    (err, row) => {
        if(row){
            response.send(row.id.toString());
        }else{
            response.send("Falha");
        }
    });
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
app.get("/savedGatesAndLoadLogic/:userId", async (request, response) => {
    console.log(`"getting gates and logic function for user ${request.params.userId} ..."`);
    // let savedGates = require("./saveData/savedGates.json");

    const savedGates = await getUserGates(request.params.userId);

    // Sort saved gates by order
    savedGates.sort((a, b) => {
        return a.function_order - b.function_order;
    });

    let accumulatedCode = NandGate.logic + "\n";
    const logicFunctions = [NandGate];
    let funcStr = "";
    savedGates.forEach((savedGate, index) => {
        accumulatedCode += savedGate.function_string + "\n";

        funcStr = accumulatedCode + `new ${savedGate.name}()`;

        // TODO: Ajustar código para novos ios
        
        if (!savedGate.hidden) {
            logicFunctions.push({
                id: savedGate.id,
                name: savedGate.name,
                logic: funcStr,
                order: savedGate.function_order,
                ios: {
                    inputs: savedGate.inputs,
                    outputs: savedGate.outputs
                },
            });
        }
    });

    response.send(logicFunctions);
});

app.delete("/gate/:id", (request, response) => {
    console.log(`Deleting gate ${request.params.id}...`);

    db.run(`
    Update gate set hidden=true where id = ?;
    `, [request.params.id]
    , function(err) {
        if (err) {
            response.send({
                error: true,
                message: `Could not find gate ${request.params.id} to delete`,
            });
            return;
        }
        // get the last insert id
        console.log(`Deleted gate ${request.params.id}`);
        response.send({
            error: false,
            message: `Deleted gate ${request.params.id}`,
        });
      });
});

// Save circuit to gate file
app.post("/circuitToGate", async (request, response) => {
    console.log("receiving data ...");
    console.log("body is ", request.body);

    const body = request.body;
    const gateName = body.gateName;
    const userId = body.userId;
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

    const savedGates = await getUserGates(userId);
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

    const newGate = generateGate(circuit, gateName);

    logicFunctionString += newGate.logicFunctionString;

    // save gate
    saveGate(userId, gateName, logicFunctionString, savedGates.length + 1, newGate.ios, false);

    response.send(request.body);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);

// database related functions
async function getUserGates(userId){
    return new Promise((resolve, reject) => {
        db.all(`select * from gate
            where user_id = ?`, 
            [userId], 
            (err, rows) => {
                if(err) {
                    reject(err);
                }
                resolve(rows);
            }
        )
    })
    
}

function saveGate(userId, gateName, functionString, functionOrder, ios, hidden){
    var currentdate = new Date();
    console.log(currentdate);
    db.run(`
    insert into gate (user_id, name, function_string, function_order, inputs, outputs, hidden, created_at, updated_at)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [userId, gateName, functionString, functionOrder, ios.inputs, ios.outputs, hidden, currentdate, currentdate]
    , function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
}
