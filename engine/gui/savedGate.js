import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Gate from "../components/gate.js";
import Button from "../ui/button.js";

class SavedGate extends Button {
    constructor(ctx, toolbox, name, path) {
        super(ctx);
        this.ctx = ctx;
        this.toolbox = toolbox;
        this.name = name;
        this.path = path;

        this.debugName = name + "_SavedGate";
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

    onLeftClick({ x, y, button }) {
        this.getLogicFunctionFromPath()
            .then((logic) => {
                if (logic) {
                    const gate = new Gate(this.ctx, logic);
                    Bridge.sceneInstance.place(gate, 1, true);
                } else {
                    console.error(`Error loading logic function from file: ${this.path}`);
                }
            })
            .catch((error) => {
                console.error(`Error loading logic function from file: ${this.path}`, error);
            });
    }

    getLogicFunctionFromPath() {
        return import(`../${this.path}`)
            .then((module) => {
                const logicFunction = module.default;

                if (typeof logicFunction === "function") {
                    return logicFunction;
                } else {
                    console.error(`Error: ${this.path} does not export a valid logic function.`);
                    return null;
                }
            })
            .catch((error) => {
                console.error(`Error loading logic function from file: ${this.path}`, error);
                return null;
            });
    }
}

export default SavedGate;
