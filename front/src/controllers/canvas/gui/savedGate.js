import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Gate from "../eletricalComponents/gate.js";
import Button from "../UIComponents/button.js";
import Mouse from "../input/mouse.js";
import DeleteManager from "../managers/deleteManager.js";

class SavedGate extends Button {
    constructor(ctx, toolbox, id, name, logicFunction, ios) {
        super(ctx);
        this.ctx = ctx;
        this.toolbox = toolbox;
        this.id = id;
        this.name = name;
        this.logicFunction = logicFunction;
        this.ios = ios;

        this.debugName = name + "_SavedGate";
        this.canCreate = true;

        Mouse.addRightClickUpEvent(this.onLeftClickUp.bind(this));
    }

    start() {
        const height = Settings.SAVED_GATE_BASE_HEIGHT;
        const textWidth = this.ctx.measureText(this.name).width;
        const padding = 20;
        const width = Math.max(Settings.SAVED_GATE_BASE_WIDTH, textWidth + padding);

        this.rect.color(Settings.SAVED_GATE_COLOR).size(width, height).at(-100, -100);
        this.rect.innerText.style("Arial", Settings.SAVED_GATE_NAME_FONT_SIZE, "#fff").content(this.name);
    }

    update() {}

    draw() {
        if (!this.rect) return;

        this.rect.draw();
    }

    onLeftClickDown({ x, y, button }) {
        const deleteMode = Settings.SCENE_MODE === Settings.SCENE_MODE_OPTIONS.DELETE;
        if (deleteMode) {
            this.delete();
        } else {
            if (!this.canCreate) return;

            const gate = new Gate(this.ctx, this.logicFunction, this.name, this.ios);
            Bridge.sceneInstance.place(gate, Settings.FOREGROUND_LAYER, true);

            this.canCreate = false;
        }
    }

    onLeftClickUp({ x, y, button }) {
        this.canCreate = true;
    }

    delete() {
        DeleteManager.deleteSavedGate(this);
    }
}

export default SavedGate;
