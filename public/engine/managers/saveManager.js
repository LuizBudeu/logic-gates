import CircuitManager from "./circuitManager.js";
import Core from "../core.js";

class SaveManager {
    static savedGates = [];

    static loadSavedGatesFromFile(finalCallback) {
        fetch("/savedGatesAndLoadLogic")
            .then((response) => response.json())
            .then((data) => {
                data.sort((a, b) => a.order - b.order);

                data.forEach((gate) => {
                    SaveManager.savedGates.push({
                        name: gate.name,
                        logicFunction: gate.logic,
                        ios: gate.ios,
                    });
                });

                finalCallback(SaveManager.savedGates);
            });
    }

    static getSavedGates() {
        return SaveManager.savedGates;
    }

    static saveCircuitToGate(gateName) {
        fetch("http://localhost:3000/circuitToGate", {
            method: "POST",
            body: JSON.stringify({
                gateName,
                circuit: CircuitManager.serialize(),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) => {
                Core.reload();
            });
    }
}

export default SaveManager;
