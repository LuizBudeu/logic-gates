class Signal {
    static setSceneInstance(sceneInstance) {
        Signal.sceneInstance = sceneInstance;
    }

    static addObjectToScene(object) {
        if (Signal.sceneInstance) {
            Signal.sceneInstance.place(object);
        } else {
            console.error("Scene instance not set. Please set it before using Signal.addObjectToScene.");
        }
    }

    static removeObjectFromScene(object) {
        if (Signal.sceneInstance) {
            Signal.sceneInstance.remove(object);
        } else {
            console.error("Scene instance not set. Please set it before using Signal.removeObjectFromScene.");
        }
    }
}

export default Signal;
