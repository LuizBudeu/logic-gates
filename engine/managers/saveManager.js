import Settings from "../settings.js";
import Bridge from "../bridge.js";
import IO from "../components/io.js";
import Gate from "../components/gate.js";
import Input from "../components/input.js";
import Output from "../components/output.js";
import CircuitManager from "./circuitManager.js";

class SaveManager {
    static funcStr = "";
    static resultCount = 0;
    // static savedGatesFromFile = [];
    static savedGatesFromLocalStorage = [];

    // static getSavedGatesFromFile(finalCallback) {
    //     let savedGatesFromFile = [];

    //     fetch("./engine/saveData/savedGates.json")
    //         .then((response) => response.json())
    //         .then((json) => {
    //             savedGatesFromFile = json;
    //         })
    //         .catch(() => {
    //             savedGatesFromFile = [
    //                 {
    //                     name: "NAND",
    //                     path: "/components/logic/NAND.js",
    //                 },
    //             ];
    //         })
    //         .finally(() => {
    //             finalCallback(savedGatesFromFile);
    //         });

    //     SaveManager.savedGatesFromFile = savedGatesFromFile;

    //     return savedGatesFromFile;
    // }

    static getSavedGatesFromLocalStorage() {
        let savedGatesFromLocalStorage = [];
        const items = { ...localStorage };

        let cumulativeCode = "";
        for (const key in items) {
            if (key.includes("savedGate:")) {
                cumulativeCode += items[key];

                const gateName = key.split("savedGate:")[1];
                const logicFunction = eval(cumulativeCode);
                savedGatesFromLocalStorage.push({
                    name: gateName,
                    logicFunction: logicFunction,
                });

                cumulativeCode = `const ${gateName} = ${cumulativeCode}; `;
            }
        }
        SaveManager.savedGatesFromLocalStorage = savedGatesFromLocalStorage;
        return savedGatesFromLocalStorage;
    }

    static loadNANDGate() {
        const savedGates = SaveManager.getSavedGatesFromLocalStorage();

        if (savedGates.length === 0) {
            localStorage.setItem("savedGate:NAND", "(input0, input1) => !(input0 && input1);");

            SaveManager.savedGatesFromLocalStorage.push({
                name: "NAND",
                logicFunction: (input0, input1) => !(input0 && input1),
            });
        }
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
        localStorage.setItem(`savedGate:${gateName}`, SaveManager.funcStr);
    }

    static checkAndWriteResultLine(gate) {
        const inputs = gate.inputs;
        const inputsConnectedToGate = inputs.filter((input) => !input.IOConnections[0].upstream.isGlobal());

        const inputsConnectedToGlobalInputs = inputs.filter((input) => input.IOConnections[0].upstream.isGlobal());

        let gateStr = `${gate.name}(`;

        if (inputsConnectedToGate.length !== 0) {
            inputsConnectedToGate.forEach((input) => {
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
}

export default SaveManager;
