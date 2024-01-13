class Bridge {
    static sceneInstance = null;

    static setSceneInstance(sceneInstance) {
        Bridge.sceneInstance = sceneInstance;
    }

    static addObjectToScene(object, layer = 0) {
        if (Bridge.sceneInstance) {
            Bridge.sceneInstance.place(object, layer);
        } else {
            console.error("Scene instance not set. Please set it before using Bridge.addObjectToScene.");
        }
    }

    static removeObjectFromScene(object, layer = 0) {
        if (Bridge.sceneInstance) {
            Bridge.sceneInstance.remove(object, layer);
        } else {
            console.error("Scene instance not set. Please set it before using Bridge.removeObjectFromScene.");
        }
    }
}

export default Bridge;
