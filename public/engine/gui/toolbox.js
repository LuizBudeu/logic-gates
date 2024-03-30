import Rect from "../UIComponents/rect.js";
import Bridge from "../bridge.js";
import Settings from "../settings.js";
import SavedGate from "./savedGate.js";
import SaveManager from "../managers/saveManager.js";
import Mouse from "../input/mouse.js";

// fazer uma toolbox draggable, movimentado-se apenas no eixo x

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

        Mouse.addLeftClickDraggingEvent(this.handleDragging.bind(this), this.rect);
        this.loadSavedGates();
    }

    handleDragging({ deltaX, deltaY }) {
        // Move the gate menu 
        if (deltaX > 0 && this.rect.at().x == 0) {            
            this.rect.x = this.rect.x;
        } else {
            this.rect.x += deltaX;
        }
    }

    loadSavedGates() {
        SaveManager.loadSavedGatesFromFile(this.setupSavedGates.bind(this));
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

            this.rect.width += savedGate.rect.width + Settings.SAVED_GATE_BASE_MARGIN.x;
        });
    }

    update() {

    }

    draw() {
        this.rect.draw();
    }
}

export default Toolbox;
