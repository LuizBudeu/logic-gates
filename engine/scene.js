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
        this.gameObjects = [];

        Signal.setSceneInstance(this);
    }

    start() {
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

    place(gameObject) {
        this.gameObjects.push(gameObject);
    }

    remove(gameObject) {
        this.gameObjects = this.gameObjects.filter((obj) => obj !== gameObject);
    }

    update() {
        this.gameObjects.forEach((gameObject) => {
            // gameObject.update();
        });
    }

    draw() {
        this.clearCanvas();
        this.drawToolBox();
        this.drawBindingBox();
        this.drawInputs();
        this.drawOutput();
        this.drawGate();
        // this.drawWire();

        this.gameObjects.forEach((gameObject) => {
            gameObject.draw();
        });
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

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        Settings.CANVAS_WIDTH = this.canvas.width;
        Settings.CANVAS_HEIGHT = this.canvas.height;
    }

    clearCanvas() {
        const rect = new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR).draw();
    }

    drawToolBox() {
        const height = 60;
        const rect = new Rect(this.ctx)
            .at(0, this.canvas.height - height)
            .size(this.canvas.width, height)
            .color("#0C0C0C")
            .draw();
    }

    drawBindingBox() {
        const rect = new Rect(this.ctx)
            .at(50, 80)
            .size(this.canvas.width - 100, this.canvas.height - 170)
            .color("#3D3D3D")
            .draw();
    }
}

export default Scene;
