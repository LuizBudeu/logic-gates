import Settings from "../settings.js";
import Bridge from "../bridge.js";
import IO from "../components/io.js";
import Gate from "../components/gate.js";
import Input from "../components/input.js";
import Output from "../components/output.js";
import CircuitManager from "./circuitManager.js";
import { splitStringOnce } from "../utils/utils.js";

class SaveManager {
    static funcStr = "";
    static resultCount = 0;
    static savedGatesFromLocalStorage = [];
    static orderedSavedGates = [];
    static savedGatesCount = 1;

    static loadSavedGatesFromLocalStorage() {
        SaveManager.savedGatesFromLocalStorage = [];

        // If there are no saved gates, save NAND gate
        if (window.localStorage.length === 0) {
            localStorage.setItem("savedGate:NAND:0", "(input0, input1) => {return !(input0 && input1);};");

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
            const [_, gateName, gateOrder] = key.split(":");
            orderedSavedGates.push({ name: `${_}:${gateName}`, order: gateOrder, code: items[key] });
        }
        SaveManager.savedGatesCount = Math.max(...orderedSavedGates.map((gate) => gate.order)) + 1;
        orderedSavedGates.sort((a, b) => a.order - b.order);
        orderedSavedGates = orderedSavedGates.map((gate) => {
            return { name: gate.name, code: gate.code };
        });

        let gates = [];
        orderedSavedGates.forEach((gate) => {
            gates[gate.name.replace("savedGate:", "")] = gate.code;
        });

        // Hydrate gates with previous definitions
        const hydratedGates = SaveManager.hydrateGates(gates);
        for (const gateName in hydratedGates) {
            const logicFunction = eval(hydratedGates[gateName]);
            SaveManager.savedGatesFromLocalStorage.push({
                name: gateName,
                logicFunction: logicFunction,
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
        const globalOutputs = CircuitManager.circuit.components.filter((component) => component instanceof Output && component.isGlobal());

        const globalInputs = CircuitManager.circuit.components.filter((component) => component instanceof Input && component.isGlobal());

        SaveManager.funcStr += `(`;
        globalInputs.forEach((input, index) => {
            SaveManager.funcStr += `input${index}`;
            if (index !== globalInputs.length - 1) SaveManager.funcStr += ", ";
        });
        SaveManager.funcStr += ") => {";

        SaveManager.resultCount = 0;

        // Get the result of each global output
        globalOutputs.forEach((output) => {
            const connection = output.IOConnections[0];
            const upstreamIO = connection.upstream;
            const gate = upstreamIO.gate;

            SaveManager.checkAndWriteResultLine(gate);
        });
        SaveManager.funcStr += `return result${SaveManager.resultCount};};`;

        // Save logic function to local storage
        localStorage.setItem(`savedGate:${gateName}:${SaveManager.savedGatesCount}`, SaveManager.funcStr);
        SaveManager.savedGatesCount++;
    }

    static checkAndWriteResultLine(gate) {
        const inputs = gate.inputs;
        const inputsConnectedToGate = inputs.filter((input) => !input.IOConnections[0]?.upstream.isGlobal());

        const inputsConnectedToGlobalInputs = inputs.filter((input) => input.IOConnections[0]?.upstream.isGlobal());

        let gateStr = `${gate.name}(`;

        if (inputsConnectedToGate.length !== 0) {
            inputsConnectedToGate.forEach((input) => {
                if (input.IOConnections.length === 0) return;
                const connection = input.IOConnections[0];
                const upstreamIO = connection.upstream;
                SaveManager.checkAndWriteResultLine(upstreamIO.gate);
                gateStr += `result${SaveManager.resultCount},`;
            });
        }

        inputsConnectedToGlobalInputs.forEach((input) => {
            const connection = input.IOConnections[0];
            const upstreamIO = connection.upstream;

            gateStr += `input${upstreamIO.debugName.split("Global_Input_")[1]},`;
        });

        // Remove the last comma
        gateStr = gateStr.slice(0, -1);
        gateStr += ");";

        SaveManager.resultCount++;
        SaveManager.funcStr += `const result${SaveManager.resultCount} = ${gateStr}`;
    }

    static hydrateGates(gates) {
        let keys = Object.keys(gates);
        let gatesHydrated = {};
        let paramCounts = {};

        for (let i = 0; i < keys.length; i++) {
            let currentKey = keys[i];
            let currentDefinition = gates[currentKey];
            let params = splitStringOnce(currentDefinition, " => {");
            let paramCount = params[0].split(",").length;

            paramCounts[currentKey] = paramCount;
        }

        for (let i = 0; i < keys.length; i++) {
            let currentKey = keys[i];
            let currentDefinition = gates[currentKey];
            let previousDefinitions = keys
                .slice(0, i)
                .map((key) => `${key} = ${gates[key]}`)
                .join("const ");

            // Generate the function signature based on the number of parameters
            let params = Array.from({ length: paramCounts[currentKey] }, (_, i) => `input${i}`).join(", ");

            currentDefinition = currentDefinition.replace(`(${params})`, "");
            if (previousDefinitions.length > 0) {
                currentDefinition = currentDefinition.replace("=> {", "");
            }

            let constPreviousDefinition = previousDefinitions.length > 0 ? `const ${previousDefinitions};` : "";
            let fullString = previousDefinitions.length > 0 ? `(${params}) => { ${constPreviousDefinition}; ${currentDefinition}` : `(${params})${currentDefinition}`;
            gatesHydrated[currentKey] = fullString;
        }

        return gatesHydrated;
    }
}

export default SaveManager;
