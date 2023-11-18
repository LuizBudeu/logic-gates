import Settings from "./settings.js";
import Scene from "./scene.js";
import Rect from "./ui/rect.js";
import Circle from "./ui/circle.js";

class Core {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.currentScene = null;
    }

    start() {
        Settings.CANVAS_WIDTH = this.canvas.width;
        Settings.CANVAS_HEIGHT = this.canvas.height;

        this.setupScene();

        // Start the game loop for continuous updates
        this.gameLoop();
    }

    update() {
        this.currentScene.update();
    }

    gameLoop() {
        const updateBound = this.update.bind(this);

        const loop = () => {
            updateBound();

            this.currentScene.draw();

            requestAnimationFrame(loop);
        };

        loop();
    }

    setupScene() {
        this.currentScene = new Scene(this.canvas, this.ctx);

        this.currentScene.setupCanvas();

        // // Canvas background
        // this.currentScene.place(new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR));

        // // Toolbox
        // this.currentScene.place(
        //     new Rect(this.ctx)
        //         .at(0, this.canvas.height - 60)
        //         .size(this.canvas.width, 60)
        //         .color("#0C0C0C")
        // );

        // // Binding box
        // this.currentScene.place(
        //     new Rect(this.ctx)
        //         .at(50, 80)
        //         .size(this.canvas.width - 100, this.canvas.height - 170)
        //         .color("#3D3D3D")
        // );

        // // Inputs
        // this.currentScene.place(new Circle(this.ctx).at(50, 313).radius(Settings.IO_CIRCLE_RADIUS).color("#1C2027"));

        // this.currentScene.place(new Circle(this.ctx).at(50, 576).radius(Settings.IO_CIRCLE_RADIUS).color("#1C2027"));

        // this.currentScene.place(
        //     new Circle(this.ctx)
        //         .at(this.canvas.width - 50, this.canvas.height / 2 - Settings.IO_CIRCLE_RADIUS)
        //         .radius(Settings.IO_CIRCLE_RADIUS)
        //         .color("#1C2027")
        // );

        this.currentScene.start();
    }
}

export default Core;
