const testCircuitJSON = require("./circuitTest.json");

function generateLogicFunction(circuitJSON, newGateName) {
    const components = circuitJSON.components;
    const connections = circuitJSON.connections;

    const globalOutputs = components.filter((component) => component.type === "output" && component.isGlobal);
    const globalInputs = components.filter((component) => component.type === "input" && component.isGlobal);

    // Get return object
    const outputObj = {};
    globalOutputs.forEach((globalOutput) => {
        const outputName = `output${globalOutput.IOId}`;
        outputObj[outputName] = "";

        const upstreamConnection = connections.find((conn) => conn.downstream === globalOutput.circuitId);
        const upstreamComponent = getUpstreamComponent(upstreamConnection);

        outputObj[outputName] += getUpstreamLogic(upstreamComponent, upstreamConnection.upstream.split("_")[1]);
    });

    // Write function name and inputs
    let logicFunctionString = `function ${newGateName} (`;
    globalInputs.forEach((globalInput, index) => {
        logicFunctionString += `input${globalInput.IOId}`;
        if (index < globalInputs.length - 1) {
            logicFunctionString += ", ";
        }
    });
    logicFunctionString += ") {\n";

    // Write return object
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

    // Recursively get the logic string for a component with memoization
    function getUpstreamLogic(upstreamComponent, outputIOId, memo = new Set()) {
        const memoKey = `${upstreamComponent.circuitId}_${outputIOId}`;

        if (memo.has(memoKey)) {
            return "";
        }

        memo.add(memoKey);

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

const logicFunctionString = generateLogicFunction(testCircuitJSON, "TEST");
console.log(logicFunctionString);
