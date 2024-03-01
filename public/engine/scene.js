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
import PlusIO from "./gui/plusIO.js";
import MinusIO from "./gui/minusIO.js";
import WiringManager from "./managers/wiringManager.js";

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
    }

    start() {
        this.globalIOs = {
            inputs: [],
            outputs: [],
        };

        this.setupBackground();
        this.setupToolbox();
        this.setupIOButtons();

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

    place(gameObject, layer = 5, start = false) {
        this.layerGameObjects[layer].push(gameObject);
        this.addToGameObjectMap(gameObject);
        if (start) gameObject.start();
    }

    remove(gameObject, layer = 5) {
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
        this.place(this.toolbox, 0);

        // Trash and save buttons
        this.place(new Trash(this.ctx), 0);
        this.place(new Save(this.ctx), 0);
        this.place(new Reset(this.ctx), 0);
    }

    setupIOButtons() {
        this.plusInput = new PlusIO(this.ctx, "input");
        this.place(this.plusInput, 0);

        this.plusOutput = new PlusIO(this.ctx, "output");
        this.place(this.plusOutput, 0);

        this.minusInput = new MinusIO(this.ctx, "input");
        this.place(this.minusInput, 0);

        this.minusOutput = new MinusIO(this.ctx, "output");
        this.place(this.minusOutput, 0);
    }

    addGlobalIO(IOtype) {
        if (IOtype === "input") {
            const input = new Input(this.ctx, true, "Global");
            input.circle.radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

            this.globalIOs.inputs.push(input);
            input.debugName += "_" + (this.globalIOs.inputs.length - 1);
            input.IOId = this.globalIOs.inputs.length - 1;
            this.place(input);
        } else {
            const output = new Output(this.ctx, "Global");
            output.circle.radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

            this.globalIOs.outputs.push(output);
            output.debugName += "_" + (this.globalIOs.outputs.length - 1);
            output.IOId = this.globalIOs.outputs.length - 1;
            this.place(output);
        }

        this.repositionGlobalIOs(IOtype);
    }

    removeGlobalIO(IOtype) {
        if (IOtype === "input") {
            if (this.globalIOs.inputs.length === 1) {
                alert("Cannot remove the last global input");
                return;
            }

            const input = this.globalIOs.inputs.pop();
            input.IOConnections.forEach((connection) => {
                CircuitManager.removeConnection(connection);
            });
            this.remove(input.selectionCircle, 0);
            CircuitManager.removeComponent(input);
            this.remove(input);
        } else {
            if (this.globalIOs.outputs.length === 1) {
                alert("Cannot remove the last global output");
                return;
            }

            const output = this.globalIOs.outputs.pop();
            output.IOConnections.forEach((connection) => {
                CircuitManager.removeConnection(connection);
            });
            this.remove(output.selectionCircle, 0);
            CircuitManager.removeComponent(output);
            this.remove(output);
        }
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
