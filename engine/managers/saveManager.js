import Settings from "../settings.js";
import Bridge from "../bridge.js";
import IO from "../components/io.js";
import Gate from "../components/gate.js";
import Input from "../components/input.js";
import Output from "../components/output.js";

class SaveManager {
    static savedGatesFromFile = [];

    static getSavedGatesFromFile(finalCallback) {
        let savedGatesFromFile = [];

        fetch("./engine/saveData/savedGates.json")
            .then((response) => response.json())
            .then((json) => {
                savedGatesFromFile = json;
            })
            .catch(() => {
                savedGatesFromFile = [
                    {
                        name: "NAND",
                        path: "/components/logic/NAND.js",
                    },
                ];
            })
            .finally(() => {
                finalCallback(savedGatesFromFile);
            });

        SaveManager.savedGatesFromFile = savedGatesFromFile;

        return savedGatesFromFile;
    }

    static saveCircuitToGate() {
        // Components are in layer 1
        let components = Bridge.sceneInstance.layerGameObjects[1];
        components = components.filter((component) => component instanceof Gate || component instanceof IO);

        const globalInputs = components.filter((component) => component instanceof Input && component.debugName === "Global_Input");

        let a = 1;

        // globalInputs.forEach((globalInput) => {
        //     const connections = globalInput.connections.filter((connection) => );
        // });
    }
}

export default SaveManager;
