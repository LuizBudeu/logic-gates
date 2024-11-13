import Bridge from "../bridge.js";
import Settings from "../settings.js";
import Core from "../core.js";

class DeleteManager {
    static axios = null;

    static deleteGameObject(gameObject, layer = Settings.FOREGROUND_LAYER) {
        Bridge.sceneInstance.remove(gameObject, layer);
    }

    static deleteSavedGate(savedGate) {
        let gateId = savedGate.id;
        DeleteManager.axios
            .delete(process.env.REACT_APP_API_HOSTNAME_PORT + "/api/deleteCircuit/" + gateId, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                Core.reload();
            });
    }
}

export default DeleteManager;
