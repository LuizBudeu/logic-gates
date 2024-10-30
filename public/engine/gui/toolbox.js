import Rect from "../UIComponents/rect.js";
import Bridge from "../bridge.js";
import Settings from "../settings.js";
import SavedGate from "./savedGate.js";
import SaveManager from "../managers/saveManager.js";
import ShiftingBar from "../UIComponents/shiftingBar.js";
import RightArrow from "./rightArrow.js";
import LeftArrow from "./leftArrow.js";

class Toolbox {
    constructor(canvas, ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.canvas = canvas;
        /** @type {HTMLCanvasElement} */
        this.ctx = ctx;

        this.debugName = "Toolbox";
    }

    start() {
        const height = Settings.TOOLBOX_HEIGHT;
        this.backgroundRect = new Rect(this.ctx)
            .at(0, this.canvas.height - height)
            .size(this.canvas.width, height)
            .color("#0C0C0C");

        this.shiftingBar = new ShiftingBar(this.ctx).at(70, this.canvas.height - height).size(this.canvas.width, height);

        this.loadSavedGates();

        Bridge.sceneInstance.place(new RightArrow(this.ctx, this.shiftingBar), 0);
        Bridge.sceneInstance.place(new LeftArrow(this.ctx, this.shiftingBar), 0);
    }

    loadSavedGates() {
        SaveManager.loadSavedGatesFromFile(this.setup.bind(this));
    }

    setup(savedGatesData) {
        savedGatesData.forEach((gateObj, index) => {
            const savedGate = new SavedGate(this.ctx, this, gateObj.name, gateObj.logicFunction, gateObj.ios);
            savedGate.start();
            this.shiftingBar.addOption(savedGate);
        });

        Bridge.sceneInstance.place(this.shiftingBar, Settings.UI_LAYER, true);
    }

    update() {}

    draw() {
        this.backgroundRect.draw();
        this.shiftingBar.draw();
    }
}

export default Toolbox;
