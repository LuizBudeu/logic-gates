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
