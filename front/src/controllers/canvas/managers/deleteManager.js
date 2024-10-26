import Bridge from "../bridge.js";
import Settings from "../settings.js";
import Core from "../core.js";

class DeleteManager {
    static deleteGameObject(gameObject, layer = Settings.FOREGROUND_LAYER) {
        Bridge.sceneInstance.remove(gameObject, layer);
    }

    static deleteSavedGate(axios, savedGate) {
        let gateId = savedGate.id;
        axios.delete(process.env.REACT_APP_API_HOSTNAME_PORT + "/gate/" + gateId, {
            headers: {
                    "Content-Type": "application/json",
                } 
            })
            .then((response) => {
                Core.reload();
            })
    }
}

export default DeleteManager;
