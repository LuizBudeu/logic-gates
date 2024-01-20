import Settings from "./settings.js";
import Rect from "./ui/rect.js";
import Input from "./components/input.js";
import Output from "./components/output.js";
import Bridge from "./bridge.js";
import TwoWayMap from "./utils/twoWayMap.js";
import Toolbox from "./toolbox.js";
import Trash from "./gui/trash.js";
import Save from "./gui/save.js";
import Mouse from "./input/mouse.js";
import Text from "./ui/text.js";
import CircuitManager from "./managers/circuitManager.js";

class Scene {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.layerGameObjects = {
            0: [], // Background
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
        };

        this.gameObjectId = 0;
        this.gameObjectsMap = new TwoWayMap();

        Bridge.setSceneInstance(this);
    }

    start() {
        this.setupBackground();
        this.setupToolbox();
        this.setupInitialComponents();

        // Start all game objects
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                gameObject.start();
            });
        }
    }

    update(deltaTime) {
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                gameObject.update(deltaTime);
            });
        }

        CircuitManager.solveCircuit();
    }

    draw() {
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                this.ctx.strokeStyle = "#000";
                gameObject.draw();
            });
        }
        // this.debug();
    }

    place(gameObject, layer = 1, start = false) {
        this.layerGameObjects[layer].push(gameObject);
        this.addToGameObjectMap(gameObject);
        if (start) gameObject.start();
    }

    remove(gameObject, layer = 1) {
        this.layerGameObjects[layer] = this.layerGameObjects[layer].filter((obj) => obj !== gameObject);
        this.removeFromGameObjectMap(gameObject);
    }

    addToGameObjectMap(gameObject) {
        this.gameObjectsMap.set(this.gameObjectId, gameObject);
        this.gameObjectId++;
    }

    removeFromGameObjectMap(gameObject) {
        this.gameObjectsMap.revDelete(gameObject);
    }

    getGameObjectById(id) {
        return this.gameObjectsMap.get(id);
    }

    getIdByGameObject(gameObject) {
        return this.gameObjectsMap.revGet(gameObject);
    }

    setSceneMode(mode) {
        Settings.SCENE_MODE = mode;
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    setupBackground() {
        // Canvas
        const canvasRect = new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR);
        this.place(canvasRect, 0);
        canvasRect.debugName = "Canvas";

        // Main container
        const mainContainerHeight = this.canvas.height - (Settings.MAIN_CONTAINER_MARGIN + 90);
        const mainContainer = new Rect(this.ctx)
            .at(Settings.MAIN_CONTAINER_MARGIN, Settings.MAIN_CONTAINER_MARGIN)
            .size(this.canvas.width - Settings.MAIN_CONTAINER_MARGIN * 2, mainContainerHeight)
            .color(Settings.MAIN_CONTAINER_COLOR);
        this.place(mainContainer, 0);
        mainContainer.debugName = "MainContainer";
    }

    setupInitialComponents() {
        const mainContainerHeight = this.canvas.height - (Settings.MAIN_CONTAINER_MARGIN + 90);

        // Inputs
        this.input1 = new Input(this.ctx, true, "Global");
        this.input1.circle
            .at(Settings.MAIN_CONTAINER_MARGIN, mainContainerHeight / 3 + Settings.MAIN_CONTAINER_MARGIN - Settings.IO_CIRCLE_RADIUS)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.place(this.input1);

        this.input2 = new Input(this.ctx, true, "Global");
        this.input2.circle
            .at(Settings.MAIN_CONTAINER_MARGIN, (mainContainerHeight * 2) / 3 + Settings.MAIN_CONTAINER_MARGIN + Settings.IO_CIRCLE_RADIUS)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.place(this.input2);

        // Output
        this.output = new Output(this.ctx, "Global");
        this.output.circle
            .at(this.canvas.width - Settings.MAIN_CONTAINER_MARGIN, mainContainerHeight / 2 + Settings.MAIN_CONTAINER_MARGIN)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.place(this.output);
    }

    setupToolbox() {
        // Toolbox
        this.toolbox = new Toolbox(this.canvas, this.ctx);
        this.place(this.toolbox, 0);

        // Trash and save buttons
        this.place(new Trash(this.ctx), 0);
        this.place(new Save(this.ctx), 0);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        Settings.CANVAS_WIDTH = this.canvas.width;
        Settings.CANVAS_HEIGHT = this.canvas.height;
    }

    debug() {
        // Show mouse coordinates
        const mousePos = Mouse.getPosition();
        mousePos.y -= 10;
        const mousePosText = new Text(this.ctx).content(`(${mousePos.x}, ${mousePos.y})`).center(mousePos.x, mousePos.y);
        mousePosText.draw();
    }
}

export default Scene;
