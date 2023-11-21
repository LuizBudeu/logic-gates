import Settings from "./settings.js";
import Rect from "./ui/rect.js";
import Circle from "./ui/circle.js";
import Gate from "./components/gate.js";
import OR from "./components/logic/OR.js";
import Text from "./ui/text.js";

class Scene {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.gameObjects = [];
    }

    start() {
        // TODO move this
        this.gate = new Gate(this.ctx, OR);
        this.gate.inputs[0].value(true);
        this.gate.inputs[1].value(true);
    }

    place(gameObject) {
        this.gameObjects.push(gameObject);
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
        this.drawANDGate();

        this.gameObjects.forEach((gameObject) => {
            gameObject.draw();
        });
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

    drawInputs() {
        // TODO make them proper inputs
        const circle1 = new Circle(this.ctx).at(50, 313).radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR).draw();

        const circle2 = new Circle(this.ctx).at(50, 576).radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR).draw();
    }

    drawOutput() {
        // TODO make proper output
        const circle = new Circle(this.ctx)
            .at(this.canvas.width - 50, this.canvas.height / 2 - Settings.IO_CIRCLE_RADIUS)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR)
            .draw();
    }

    drawANDGate() {
        this.gate.compute();
        this.gate.draw();
    }
}

export default Scene;
