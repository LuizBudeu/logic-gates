import CircuitManager from "./circuitManager.js";
import Core from "../core.js";
import { Component } from "react";

class SaveManager extends Component {

    static savedGates = [];

    static loadSavedGatesFromFile(axios, finalCallback) {
        axios.get(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/listCircuits")
            .then((response) => {
                let resp = response.data;
                resp.sort((a, b) => a.order - b.order);

                resp.forEach((gate) => {
                    SaveManager.savedGates.push({
                        id: gate.id,
                        name: gate.name,
                        logicFunction: gate.logic,
                        ios: gate.ios,
                    });
                });

                finalCallback(SaveManager.savedGates);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    static getSavedGates() {
        return SaveManager.savedGates;
    }

    static saveCircuitToGate(axios, gateName) {
        const body = JSON.stringify({
            gateName: gateName,
            circuit: CircuitManager.serialize(),
        });
        try {
            axios.post(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/saveCircuit", body, {
                headers: {
                        "Content-Type": "application/json",
                    } 
                })
                .then((response) => {
                    let resp = response.data;
                    Core.reload();
                })
                .catch((e) => {
                    if (e.response.data.message?.includes("Gate name already exists")) {
                        alert(`Gate with name ${gateName} already exists. Please choose a different name`);
                        return;
                    }
                });
        } catch {
            Core.reload();
        }
    }
}

export default SaveManager;
