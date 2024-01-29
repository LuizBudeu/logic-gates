import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Gate from "../eletricalComponents/gate.js";
import Button from "../UIComponents/button.js";
import Mouse from "../input/mouse.js";

class SavedGate extends Button {
    constructor(ctx, toolbox, name, logicFunction) {
        super(ctx);
        this.ctx = ctx;
        this.toolbox = toolbox;
        this.name = name;
        this.logicFunction = logicFunction;
        // this.path = path;

        this.debugName = name + "_SavedGate";
        this.canCreate = true;

        Mouse.addRightClickUpEvent(this.onLeftClickUp.bind(this));
    }

    start() {
        this.rect.color(Settings.SAVED_GATE_COLOR);
        this.rect.innerText.style("Arial", 15, "#fff").content(this.name);
    }

    update() {}

    draw() {
        if (!this.rect) return;

        this.rect.draw();
    }

    onLeftClickDown({ x, y, button }) {
        if (!this.canCreate) return;

        const gate = new Gate(this.ctx, this.logicFunction, this.name);
        Bridge.sceneInstance.place(gate, 1, true);

        this.canCreate = false;
    }

    onLeftClickUp({ x, y, button }) {
        this.canCreate = true;
    }
}

export default SavedGate;
