import Rect from "../UIComponents/rect.js";
import Bridge from "../bridge.js";
import Settings from "../settings.js";
import SavedGate from "./savedGate.js";
import SaveManager from "../managers/saveManager.js";

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
        this.rect = new Rect(this.ctx)
            .at(0, this.canvas.height - height)
            .size(this.canvas.width, height)
            .color("#0C0C0C");

        this.loadSavedGates();
    }

    loadSavedGates() {
        // Get user id
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const userId = urlParams.get('id');

        SaveManager.loadSavedGatesFromFile(this.setupSavedGates.bind(this), userId);
    }

    setupSavedGates(savedGatesData) {
        const toolboxPos = this.rect.at();
        let lastSavedGateX = 0;

        savedGatesData.forEach((gateObj, index) => {
            const savedGate = new SavedGate(this.ctx, this, gateObj.name, gateObj.logicFunction, gateObj.ios);
            savedGate.start();

            const gateX = toolboxPos.x + lastSavedGateX + Settings.SAVED_GATE_BASE_MARGIN.x;
            const gateY = toolboxPos.y + Settings.SAVED_GATE_BASE_MARGIN.y;

            lastSavedGateX += savedGate.rect.width + Settings.SAVED_GATE_BASE_MARGIN.x;

            savedGate.rect.at(gateX, gateY);
            savedGate.rect.innerText.centerInRect(savedGate.rect);
            Bridge.sceneInstance.place(savedGate, 0);
        });
    }

    update() {}

    draw() {
        this.rect.draw();
    }
}

export default Toolbox;
