import Bridge from "../bridge.js";
import Settings from "../settings.js";
import Core from "../core.js";

class DeleteManager {
    static deleteGameObject(gameObject, layer = Settings.FOREGROUND_LAYER) {
        Bridge.sceneInstance.remove(gameObject, layer);
    }

    static deleteSavedGate(savedGate) {
        let gateName = savedGate.name.toUpperCase();
        fetch("/gate/" + gateName, {
            method: "DELETE",
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

export default DeleteManager;
