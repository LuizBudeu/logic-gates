const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { log } = require("console");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const JWT_SECRET = "NandesiIoJwtSecret";
const saltRounds = 10;

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
        inputs: 2,
        outputs: 1,
    },
};

let db = new sqlite3.Database("./database/Nandesis.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the Nandesis.db SQlite database.");
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(cors());
app.use(cookieParser());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para proteger rotas
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get("/docs", (request, response) => {
    response.sendFile(path.join(__dirname, "/public/pages/docs.html"));
});

app.get("/solutions", (request, response) => {
    response.sendFile(path.join(__dirname, "/public/pages/solutions.html"));
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
    response.sendFile(path.join(__dirname, "/public/pages/login.html"));
});

// login route
app.post("/login", async (request, response) => {
    const body = request.body;
    let email = body.email;
    let password = body.password;

    await db.get(
        `select id, password from user
        where email = ?`,
        [email],
        async (err, row) => {
            if (row) {
                const match = await bcrypt.compare(password, row.password);
                if (!match) {
                    response.send({ message: "Falha login" });
                } else {
                    const token = jwt.sign({ id: row.id }, JWT_SECRET, { expiresIn: "1h" });

                    // Definir o token em um cookie HTTP-only
                    response.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
                    response.json({ message: "Login bem-sucedido" });
                }
            } else {
                response.send({ message: "Falha login" });
            }
        }
    );
});

// register page route
app.get("/register", (request, response) => {
    response.sendFile(path.join(__dirname, "/public/pages/register.html"));
});

// login route
app.post("/register", async (request, response) => {
    const body = request.body;
    let name = body.name;
    let email = body.email;
    let password = body.password;

    let passwordHash = await bcrypt.hash(password, saltRounds);

    let hasUser = await checkUserByEmail(email);

    if (hasUser) {
        response.send({ message: "Usuario cadastrado" });
    } else {
        let userId = await registerUser(name, email, passwordHash);

        if (userId) {
            const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });

            // Definir o token em um cookie HTTP-only
            response.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
            response.json({ message: "Cadastro bem-sucedido" });
        } else {
            response.send({ message: "Falha cadastro" });
        }
    }
});

// ** Autenticated routes **//

// login route
app.post("/logout", (request, response) => {
    response.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    response.json({ message: "OK" });
});

// Main route
app.get("/home", authenticateToken, (request, response) => {
    response.sendFile(path.join(__dirname, "/public/index.html"));
});

// Get all logic functions from files
app.get("/savedGatesAndLoadLogic", authenticateToken, async (request, response) => {
    const userId = request.user.id;
    console.log(`"getting gates and logic function for user ${userId} ..."`);
    // let savedGates = require("./saveData/savedGates.json");

    const savedGates = await getUserGates(userId);

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
                    outputs: savedGate.outputs,
                },
            });
        }
    });

    console.log(logicFunctions);
    response.send(logicFunctions);
});

app.delete("/gate/:id", (request, response) => {
    console.log(`Deleting gate ${request.params.id}...`);

    db.run(
        `
    Update gate set hidden=true where id = ?;
    `,
        [request.params.id],
        function (err) {
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
        }
    );
});

// Save circuit to gate file
app.post("/circuitToGate", authenticateToken, async (request, response) => {
    const userId = request.user.id;
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

// Get users missions status
app.get("/missions", authenticateToken, async (request, response) => {
    const userId = request.user.id;
    let userMissions = await getUserMissions(userId);

    response.send(userMissions);
});

// Save users missions status
app.post("/saveMission", authenticateToken, async (request, response) => {
    const userId = request.user.id;
    const body = request.body;

    let missions = body.missions;

    await deleteUserMissions(userId);

    for (const missionId of missions) {
        await insertUserMissions(userId, missionId);
    }
});

// Get user info
app.get("/user/", authenticateToken, async (request, response) => {
    const userId = request.user.id;
    let user = await getUserInfo(userId);

    response.send(user);
});

// Default route
app.get("*", function (req, res) {
    res.redirect("/login");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);

// database related functions
async function getUserGates(userId) {
    return new Promise((resolve, reject) => {
        db.all(
            `select * from gate
            where user_id = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

function saveGate(userId, gateName, functionString, functionOrder, ios, hidden) {
    var currentdate = new Date();
    console.log(currentdate);
    db.run(
        `
    insert into gate (user_id, name, function_string, function_order, inputs, outputs, hidden, created_at, updated_at)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
        [userId, gateName, functionString, functionOrder, ios.inputs, ios.outputs, hidden, currentdate, currentdate],
        function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
    );
}

async function getUserMissions(userId) {
    return new Promise((resolve, reject) => {
        db.all(
            `select M.id, name, [order], description_url, solution_url,
                (UM.user_id is not null) as checked 
                from mission as M
                left join user_mission as UM ON UM.mission_id = M.id AND UM.user_id = ?
                order by [order] asc`,
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

async function insertUserMissions(userId, mission_id) {
    return new Promise((resolve, reject) => {
        db.all(
            `insert into user_mission (user_id, mission_id, created_at, updated_at)
            values (?, ?, DATE('now'), DATE('now'))`,
            [userId, mission_id],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

async function deleteUserMissions(userId) {
    return new Promise((resolve, reject) => {
        db.all(
            `delete from user_mission
            where user_id = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

async function getUserInfo(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `select name
                from user
                where id = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

async function checkUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get(
            `select *
                from user
                where email = ?`,
            [email],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows != null);
            }
        );
    });
}

async function registerUser(name, email, password) {
    var currentdate = new Date();
    return new Promise((resolve, reject) => {
        db.run(
            `
            insert into user (name, email, password, created_at, updated_at)
            values (?, ?, ?, ?, ?);
            `,
            [name, email, password, currentdate, currentdate],
            function (err) {
                if (err) {
                    reject(err);
                }
                resolve(this.lastID);
            }
        );
    });
}
