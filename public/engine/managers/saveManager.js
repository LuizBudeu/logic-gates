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
        try {
            fetch("/circuitToGate", {
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
                    if (json.message?.includes("Gate name already exists")) {
                        alert(`Gate with name ${gateName} already exists. Please choose a different name`);
                        return;
                    }
                    Core.reload();
                });
        } catch {
            Core.reload();
        }
    }
}

export default SaveManager;
