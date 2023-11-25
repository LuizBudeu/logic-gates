import Settings from "./settings.js";
import Rect from "./ui/rect.js";
import Circle from "./ui/circle.js";
import Input from "./components/input.js";
import Output from "./components/output.js";
import Gate from "./components/gate.js";
import Wire from "./components/wire.js";
import OR from "./components/logic/OR.js";
import Text from "./ui/text.js";
import Signal from "./signal.js";

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

        Signal.setSceneInstance(this);
    }

    start() {
        this.setupBackground();

        // Inputs
        this.input1 = new Input(this.ctx, this);
        this.input1.circle.at(50, 313).radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

        this.input2 = new Input(this.ctx, this);
        this.input2.circle.at(50, 576).radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

        // Output
        this.output = new Output(this.ctx);
        this.output.circle
            .at(this.canvas.width - 50, this.canvas.height / 2 - Settings.IO_CIRCLE_RADIUS)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        // Gate
        this.gate = new Gate(this.ctx, OR, this);
        this.gate.inputs[0].value(true);
        this.gate.inputs[1].value(true);

        // // Wire
        // this.wire = new Wire(this.ctx);
        // this.wire.connect(this.input1.circle.x, this.input1.circle.y, this.gate.inputs[0].circle.x, this.gate.inputs[0].circle.y);
    }

    place(gameObject, layer = 1) {
        this.layerGameObjects[layer].push(gameObject);
    }

    remove(gameObject, layer = 1) {
        this.layerGameObjects[layer] = this.layerGameObjects[layer].filter((obj) => obj !== gameObject);
    }

    update(deltaTime) {
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                // gameObject.update();
            });
        }
    }

    draw() {
        // this.clearCanvas();
        // this.drawToolBox();
        // this.drawBindingBox();

        // this.gameObjects.forEach((gameObject) => {
        //     gameObject.draw();
        // });
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                gameObject.draw();
            });
        }

        this.drawInputs();
        this.drawOutput();
        this.drawGate();
        // // this.drawWire();
    }

    drawInputs() {
        this.input1.circle.draw();
        this.input2.circle.draw();
    }

    drawOutput() {
        this.output.circle.draw();
    }

    drawGate() {
        this.gate.compute();
        this.gate.draw();
    }

    drawWire() {
        this.wire.draw();
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    setupBackground() {
        // Canvas
        const canvasRect = new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR);
        this.place(canvasRect, 0);

        // Toolbox
        const toolboxHeight = 60;
        const toolboxRect = new Rect(this.ctx)
            .at(0, this.canvas.height - toolboxHeight)
            .size(this.canvas.width, toolboxHeight)
            .color("#0C0C0C");
        this.place(toolboxRect, 0);

        // Binding box
        const bindingBoxRect = new Rect(this.ctx)
            .at(50, 80)
            .size(this.canvas.width - 100, this.canvas.height - 170)
            .color("#3D3D3D");
        this.place(bindingBoxRect, 0);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        Settings.CANVAS_WIDTH = this.canvas.width;
        Settings.CANVAS_HEIGHT = this.canvas.height;
    }

    // clearCanvas() {
    //     const rect = new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR).draw();
    // }

    // drawToolBox() {
    //     const height = 60;
    //     const rect = new Rect(this.ctx)
    //         .at(0, this.canvas.height - height)
    //         .size(this.canvas.width, height)
    //         .color("#0C0C0C")
    //         .draw();
    // }

    // drawBindingBox() {
    //     const rect = new Rect(this.ctx)
    //         .at(50, 80)
    //         .size(this.canvas.width - 100, this.canvas.height - 170)
    //         .color("#3D3D3D")
    //         .draw();
    // }
}

export default Scene;
