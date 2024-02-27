const testCircuitJSON = {
    components: [
        { type: "input", circuitId: "0", isGlobal: true, IOId: "0" },
        { type: "input", circuitId: "1", isGlobal: true, IOId: "1" },
        { type: "output", circuitId: "2", isGlobal: true, IOId: "0" },
        { type: "gate", name: "NOT", circuitId: "3", inputs: [{ IOId: "0" }], outputs: [{ IOId: "0" }] },
        { type: "gate", name: "NOT", circuitId: "4", inputs: [{ IOId: "0" }], outputs: [{ IOId: "0" }] },
        { type: "gate", name: "NAND", circuitId: "5", inputs: [{ IOId: "0" }, { IOId: "1" }], outputs: [{ IOId: "0" }] },
        { type: "gate", name: "NAND", circuitId: "6", inputs: [{ IOId: "0" }, { IOId: "1" }], outputs: [{ IOId: "0" }] },
        { type: "gate", name: "NOT", circuitId: "7", inputs: [{ IOId: "0" }], outputs: [{ IOId: "0" }] },
        { type: "output", circuitId: "8", isGlobal: true, IOId: "1" },
    ],
    connections: [
        { upstream: "1", downstream: "3_input0" },
        { upstream: "3_output0", downstream: "4_input0" },
        { upstream: "4_output0", downstream: "5_input1" },
        { upstream: "1", downstream: "5_input0" },
        { upstream: "0", downstream: "6_input0" },
        { upstream: "0", downstream: "6_input1" },
        { upstream: "6_output0", downstream: "7_input0" },
        { upstream: "7_output0", downstream: "2" },
        { upstream: "5_output0", downstream: "8" },
    ],
};

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

const logicFunctionString = generateLogicFunction(testCircuitJSON, "TEST");
console.log(logicFunctionString);
