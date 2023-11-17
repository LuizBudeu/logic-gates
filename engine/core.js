import Settings from "./settings.js";
import Rect from "./ui/rect.js";
import Circle from "./ui/circle.js";

class Core {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
    }

    update() {}

    gameLoop() {
        const updateBound = this.update.bind(this);

        const loop = () => {
            updateBound();

            this.drawEverything();

            // this.drawA(this.b);

            requestAnimationFrame(loop);
        };

        loop();
    }

    start() {
        this.setupCanvas();

        // this.b = this.a();

        // Start the game loop for continuous updates
        this.gameLoop();
    }

    setupCanvas() {
        this.resizeCanvas();

        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clearCanvas() {
        const rect = new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR).draw();
    }

    drawEverything() {
        this.clearCanvas();
        this.drawToolBox();
        this.drawBindingBox();
        this.drawInputs();
        this.drawOutput();
    }

    drawToolBox() {
        const rect = new Rect(this.ctx)
            .at(0, this.canvas.height - 60)
            .size(this.canvas.width, 60)
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
        const circle1 = new Circle(this.ctx).at(50, 313).radius(Settings.IO_CIRCLE_RADIUS).color("#1C2027").draw();

        const circle2 = new Circle(this.ctx).at(50, 576).radius(Settings.IO_CIRCLE_RADIUS).color("#1C2027").draw();
    }

    drawOutput() {
        // TODO make proper output
        const circle = new Circle(this.ctx)
            .at(this.canvas.width - 50, this.canvas.height / 2 - Settings.IO_CIRCLE_RADIUS)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color("#1C2027")
            .draw();
    }

    // a() {
    //     const circle = new Circle(this.ctx).at(100, 100).radius(50).color("#ffffff");

    //     return circle;
    // }

    // drawA(circle) {
    //     circle.debug();
    //     circle.draw();
    // }
}

export default Core;
