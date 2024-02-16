import Settings from "../settings.js";
import Bridge from "../bridge.js";
import IO from "../eletricalComponents/io.js";
import Gate from "../eletricalComponents/gate.js";
import Input from "../eletricalComponents/input.js";
import Output from "../eletricalComponents/output.js";
import CircuitManager from "./circuitManager.js";
import { splitStringOnce } from "../utils/utils.js";
import Save from "../gui/saveButton.js";

class SaveManager {
    static funcStr = "";
    static resultCount = 0;
    static savedGatesFromLocalStorage = [];
    static orderedSavedGates = [];
    static savedGatesCount = 1;
    static savingGate = null;

    static loadSavedGatesFromLocalStorage() {
        SaveManager.savedGatesFromLocalStorage = [];

        // If there are no saved gates, save NAND gate
        if (window.localStorage.length === 0) {
            localStorage.setItem("savedGate:NAND:2_1:0", `(input0, input1) => {const output = {}; const result1 = !(input0 && input1); output["output0"] = result1; return output };`);

            SaveManager.savedGatesFromLocalStorage.push({
                name: "NAND",
                logicFunction: (input0, input1) => !(input0 && input1),
            });

            SaveManager.orderedSavedGates.push("savedGate:NAND");

            return SaveManager.savedGatesFromLocalStorage;
        }

        // Else, load saved gates from local storage
        const items = { ...localStorage };

        // Order saved gates
        let orderedSavedGates = [];
        const itemsKeys = Object.keys(items);
        for (let i = 0; i < itemsKeys.length; i++) {
            const key = itemsKeys[i];
            const [_, gateName, ios, gateOrder] = key.split(":");
            const iosSplit = ios.split("_").map(Number);
            const iosInputs = iosSplit[0];
            const iosOutputs = iosSplit[1];
            orderedSavedGates.push({ name: `${_}:${gateName}`, order: gateOrder, code: items[key], ios: { inputs: iosInputs, outputs: iosOutputs } });
        }
        SaveManager.savedGatesCount = Math.max(...orderedSavedGates.map((gate) => gate.order)) + 1;
        orderedSavedGates.sort((a, b) => a.order - b.order);
        orderedSavedGates = orderedSavedGates.map((gate) => {
            const gateName = gate.name.replace("savedGate:", "");
            return { name: gateName, code: gate.code, ios: gate.ios };
        });

        // let gates = [];
        // orderedSavedGates.forEach((gate) => {
        //     const gateName = gate.name.replace("savedGate:", "");
        //     gates.push({
        //         gateName: {
        //             code: gate.code,
        //             ios: gate.ios,
        //         },
        //     });
        // });

        // Hydrate gates with previous definitions
        const hydratedGates = SaveManager.hydrateGates(orderedSavedGates);
        for (const gateName in hydratedGates) {
            const logicFunction = eval(hydratedGates[gateName].code);
            const ios = hydratedGates[gateName].ios;
            SaveManager.savedGatesFromLocalStorage.push({
                name: gateName,
                logicFunction: logicFunction,
                ios: ios,
            });
            if (!SaveManager.orderedSavedGates.includes(`savedGate:${gateName}`)) {
                SaveManager.orderedSavedGates.push(`savedGate:${gateName}`);
            }
        }

        return SaveManager.savedGatesFromLocalStorage;
    }

    static getSavedGates() {
        return SaveManager.savedGatesFromLocalStorage;
    }

    static saveCircuitToGate(gateName) {
        SaveManager.savingGate = gateName;
        SaveManager.funcStr = `(`;
        SaveManager.resultCount = 0;

        const globalOutputs = CircuitManager.circuit.components.filter((component) => component instanceof Output && component.isGlobal());

        const globalInputs = CircuitManager.circuit.components.filter((component) => component instanceof Input && component.isGlobal());

        globalInputs.forEach((input, index) => {
            SaveManager.funcStr += `input${index}`;
            if (index !== globalInputs.length - 1) SaveManager.funcStr += ", ";
        });

        SaveManager.funcStr += ") => { const output = {};";

        // Get the result of each global output
        globalOutputs.forEach((output) => {
            const connection = output.IOConnections[0];
            const upstreamIO = connection.upstream;
            const gate = upstreamIO.gate;

            SaveManager.checkAndWriteResultLine(gate);

            const outputIndex = output.debugName.split("Global_Output_")[1];

            SaveManager.funcStr += `output["output${outputIndex}"] = result${SaveManager.resultCount - 1}`;

            if (SaveManager.savingGate === "NAND") {
                SaveManager.funcStr += `;`;
            } else {
                SaveManager.funcStr += `["output${SaveManager.resultCount - 1}"];`;
            }
        });
        SaveManager.funcStr += `return output;};`;

        // Save logic function to local storage
        localStorage.setItem(`savedGate:${gateName}:${globalInputs.length}_${globalOutputs.length}:${SaveManager.savedGatesCount}`, SaveManager.funcStr);

        SaveManager.savedGatesCount++;
        SaveManager.savingGate = null;
    }

    static checkAndWriteResultLine(gate) {
        const inputs = gate.inputs;
        const inputsConnectedToGate = inputs.filter((input) => !input.IOConnections[0]?.upstream.isGlobal());

        const inputsConnectedToGlobalInputs = inputs.filter((input) => input.IOConnections[0]?.upstream.isGlobal());

        let gateStr = `${gate.name}(`;

        // If there are inputs connected to the gate, then recursively write the result of the upstream gate
        if (inputsConnectedToGate.length !== 0) {
            inputsConnectedToGate.forEach((input) => {
                if (input.IOConnections.length === 0) return;
                const connection = input.IOConnections[0];
                const upstreamIO = connection.upstream;
                SaveManager.checkAndWriteResultLine(upstreamIO.gate);
                gateStr += `result${SaveManager.resultCount},`;
            });
        }

        // Write the result of the global inputs
        inputsConnectedToGlobalInputs.forEach((input) => {
            const connection = input.IOConnections[0];
            const upstreamIO = connection.upstream;

            gateStr += `input${upstreamIO.debugName.split("Global_Input_")[1]},`;
        });

        // Remove the last comma
        gateStr = gateStr.slice(0, -1);
        gateStr += ");";

        SaveManager.funcStr += `const result${SaveManager.resultCount} = ${gateStr}`;
        SaveManager.resultCount++;
    }

    static hydrateGates(orderedGates) {
        // const gates = SaveManager.extractCode(orderedGates);

        // let keys = Object.keys(gates);
        let gatesHydrated = {};
        let paramCounts = {};

        // Get the number of parameters for each gate
        // for (let i = 0; i < orderedGates.length; i++) {
        //     let currentKey = keys[i];
        //     let currentDefinition = gates[currentKey];
        //     let params = splitStringOnce(currentDefinition, " => {");
        //     let paramCount = params[0].split(",").length;

        //     paramCounts[currentKey] = paramCount;
        // }

        // // Hydrate the gates with previous definitions
        // for (let i = 0; i < keys.length; i++) {
        //     let currentKey = keys[i];
        //     let currentDefinition = gates[currentKey];
        //     let previousDefinitions = keys
        //         .slice(0, i)
        //         .map((key) => `${key} = ${gates[key]}`)
        //         .join("const ");

        //     // Generate the function signature based on the number of parameters
        //     let params = Array.from({ length: paramCounts[currentKey] }, (_, i) => `input${i}`).join(", ");

        //     currentDefinition = currentDefinition.replace(`(${params})`, "");
        //     if (previousDefinitions.length > 0) {
        //         currentDefinition = currentDefinition.replace("=> {", "");
        //     }

        //     let constPreviousDefinition = previousDefinitions.length > 0 ? `const ${previousDefinitions};` : "";
        //     let fullString = previousDefinitions.length > 0 ? `(${params}) => { ${constPreviousDefinition}; ${currentDefinition}` : `(${params})${currentDefinition}`;

        //     gatesHydrated[currentKey] = {
        //         code: fullString,
        //         ios: orderedGates[currentKey].ios,
        //     };
        // }

        orderedGates.forEach((gate) => {
            paramCounts[gate.name] = gate.ios.inputs;
        });

        orderedGates.forEach((gate, index) => {
            let currentKey = gate.name;
            let currentDefinition = gate.code;
            let previousDefinitions = orderedGates
                .slice(0, index)
                .map((gate) => `${gate.name} = ${gate.code}`)
                .join("const ");

            // Generate the function signature based on the number of parameters
            let params = Array.from({ length: paramCounts[currentKey] }, (_, i) => `input${i}`).join(", ");

            currentDefinition = currentDefinition.replace(`(${params})`, "");
            if (previousDefinitions.length > 0) {
                currentDefinition = currentDefinition.replace("=> {", "");
            }

            let constPreviousDefinition = previousDefinitions.length > 0 ? `const ${previousDefinitions};` : "";
            let fullString = previousDefinitions.length > 0 ? `(${params}) => { ${constPreviousDefinition}; ${currentDefinition}` : `(${params})${currentDefinition}`;

            gatesHydrated[currentKey] = {
                code: fullString,
                ios: orderedGates[index].ios,
            };
        });

        return gatesHydrated;
    }

    static extractCode(gates) {
        const newGates = {};
        for (const key in gates) {
            if (gates.hasOwnProperty(key) && gates[key].code) {
                newGates[key] = gates[key].code;
            }
        }
        return newGates;
    }
}

export default SaveManager;
