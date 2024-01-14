import Bridge from "../bridge.js";
import Settings from "../settings.js";

class DeleteManager {
    static deleteGameObject(gameObject) {
        Bridge.sceneInstance.remove(gameObject);
    }
}

export default DeleteManager;
