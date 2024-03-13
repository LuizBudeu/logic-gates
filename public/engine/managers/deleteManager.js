import Bridge from "../bridge.js";
import Settings from "../settings.js";

class DeleteManager {
    static deleteGameObject(gameObject, layer = Settings.FOREGROUND_LAYER) {
        Bridge.sceneInstance.remove(gameObject, layer);
    }
}

export default DeleteManager;
