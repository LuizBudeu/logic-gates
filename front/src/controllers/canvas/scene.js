import Settings from "./settings.js";
import Rect from "./UIComponents/rect.js";
import Input from "./eletricalComponents/input.js";
import Output from "./eletricalComponents/output.js";
import Bridge from "./bridge.js";
import TwoWayMap from "./utils/twoWayMap.js";
import Toolbox from "./gui/toolbox.js";
import Trash from "./gui/trashButton.js";
import Save from "./gui/saveButton.js";
import Reset from "./gui/resetButton.js";
import Mouse from "./input/mouse.js";
import Text from "./UIComponents/text.js";
import CircuitManager from "./managers/circuitManager.js";
import SaveManager from "./managers/saveManager.js";
import DeleteManager from "./managers/deleteManager.js";
import PlusIO from "./gui/plusIO.js";
import MinusIO from "./gui/minusIO.js";
import WiringManager from "./managers/wiringManager.js";
import Keyboard, { Keys } from "./input/keyboard.js";

class Scene {
    constructor(canvas, ctx, axios) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.axios = axios;

        this.layerGameObjects = {
            0: [], // Background
            1: [],
            2: [],
            3: [],
            4: [],
            5: [], // Foreground
            6: [],
            7: [],
            8: [], // UI
            9: [],
            10: [],
        };

        this.gameObjectId = 0;
        this.gameObjectsMap = new TwoWayMap();

        Bridge.setSceneInstance(this);

        // Pass axios to managers
        SaveManager.axios = this.axios;
        DeleteManager.axios = this.axios;
    }

    start() {
        this.globalIOs = {
            inputs: [],
            outputs: [],
        };

        this.setupBackground();
        this.setupToolbox();
        this.setupIOButtons();
        this.setupInitialListeners();

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
                // Game objects can mess with the context, so we need to reset it every time
                this.ctx.strokeStyle = "#000";
                this.ctx.font = "20px Arial";
                gameObject.draw();
            });
        }
        // this.debug();
    }

    place(gameObject, layer = Settings.FOREGROUND_LAYER, start = false) {
        this.layerGameObjects[layer].push(gameObject);
        this.addToGameObjectMap(gameObject);
        if (start) gameObject.start();
    }

    remove(gameObject, layer = Settings.FOREGROUND_LAYER) {
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
        this.addGlobalIO("input");
        this.addGlobalIO("input");
        this.addGlobalIO("output");
    }

    setupToolbox() {
        // Toolbox
        this.toolbox = new Toolbox(this.canvas, this.ctx);
        this.place(this.toolbox, Settings.BACKGROUND_LAYER);

        // Trash and save buttons
        this.place(new Trash(this.ctx), Settings.BACKGROUND_LAYER);
        this.place(new Save(this.ctx), Settings.BACKGROUND_LAYER);
        this.place(new Reset(this.ctx), Settings.BACKGROUND_LAYER);
    }

    setupInitialListeners() {
        // Press H to hide/show IO labels
        Keyboard.addKeyDownEvent(() => {
            Settings.IS_SHOWING_IO_LABELS = !Settings.IS_SHOWING_IO_LABELS;
        }, Keys.H);
    }

    setupIOButtons() {
        this.plusInput = new PlusIO(this.ctx, "input");
        this.place(this.plusInput, Settings.BACKGROUND_LAYER);

        this.plusOutput = new PlusIO(this.ctx, "output");
        this.place(this.plusOutput, Settings.BACKGROUND_LAYER);

        this.minusInput = new MinusIO(this.ctx, "input");
        this.place(this.minusInput, Settings.BACKGROUND_LAYER);

        this.minusOutput = new MinusIO(this.ctx, "output");
        this.place(this.minusOutput, Settings.BACKGROUND_LAYER);
    }

    addGlobalIO(IOtype) {
        const io = IOtype === "input" ? new Input(this.ctx, true, "Global") : new Output(this.ctx, "Global");
        io.circle.radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

        const ioArray = IOtype === "input" ? this.globalIOs.inputs : this.globalIOs.outputs;
        ioArray.push(io);
        io.debugName += "_" + (ioArray.length - 1);
        io.IOId = ioArray.length - 1;
        this.place(io, Settings.FOREGROUND_LAYER);

        this.repositionGlobalIOs(IOtype);
    }

    removeGlobalIO(IOtype) {
        const ioArray = IOtype === "input" ? this.globalIOs.inputs : this.globalIOs.outputs;

        if (ioArray.length === 1) {
            alert(`Cannot remove the last global ${IOtype}`);
            return;
        }

        const io = ioArray.pop();
        io.delete();

        this.repositionGlobalIOs(IOtype);
    }

    repositionGlobalIOs(IOtype) {
        if (IOtype === "input") {
            this.globalIOs.inputs.forEach((input, index) => {
                const IOPos = this.calculateIOPosition(index, "input");
                input.circle.at(IOPos.x, IOPos.y);
                WiringManager.moveWiring(input);
            });
        } else {
            this.globalIOs.outputs.forEach((output, index) => {
                const IOPos = this.calculateIOPosition(index, "output");
                output.circle.at(IOPos.x, IOPos.y);
                WiringManager.moveWiring(output);
            });
        }
    }

    calculateIOPosition(index, IOtype) {
        const IOcount = IOtype === "input" ? this.globalIOs.inputs.length : this.globalIOs.outputs.length;

        const mainContainerHeight = this.canvas.height - (Settings.MAIN_CONTAINER_MARGIN + 90);
        if (IOtype === "input") {
            return {
                x: Settings.MAIN_CONTAINER_MARGIN,
                y: ((mainContainerHeight + Settings.MAIN_CONTAINER_MARGIN) * (index + 1)) / (IOcount + 1),
            };
        } else {
            return {
                x: Settings.CANVAS_WIDTH - Settings.MAIN_CONTAINER_MARGIN,
                y: ((mainContainerHeight + Settings.MAIN_CONTAINER_MARGIN) * (index + 1)) / (IOcount + 1),
            };
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 60; // 60px for top html header
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
