import Rect from "./ui/rect.js";
import Bridge from "./bridge.js";
import Settings from "./settings.js";
import SavedGate from "./gui/savedGate.js";

class Toolbox {
    constructor(canvas, ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.canvas = canvas;
        /** @type {HTMLCanvasElement} */
        this.ctx = ctx;

        this.savedGatesFromFile = [];
        this.savedGates = [];
    }

    initSavedGates() {
        fetch("./engine/saveData/savedGates.json")
            .then((response) => response.json())
            .then((json) => {
                this.savedGatesFromFile = json;
            })
            .catch(() => {
                this.savedGatesFromFile = [
                    {
                        name: "NAND",
                        path: "/components/logic/NAND.js",
                    },
                ];
            })
            .finally(() => {
                this.savedGatesFromFile.forEach((gateObj, index) => {
                    const savedGate = new SavedGate(this.ctx, this, gateObj.name, gateObj.path);
                    savedGate.start();

                    // Set dimensions for the saved gate
                    const height = 40;
                    const width = 80;
                    savedGate.rect.size(width, height);

                    // Set margin and spacing between saved gates
                    const margin = {
                        x: 10,
                        y: 10,
                    };
                    const spacing = width + margin.x;

                    // Calculate position for the saved gate
                    const toolboxPos = this.rect.at();
                    const gateX = toolboxPos.x + margin.x + index * spacing;
                    const gateY = toolboxPos.y + margin.y;

                    savedGate.rect.at(gateX, gateY);
                    savedGate.rect.innerText.centerInRect(savedGate.rect);

                    this.savedGates.push(savedGate);

                    Bridge.sceneInstance.place(savedGate, 0);
                });
            });
    }

    start() {
        const height = 60;
        this.rect = new Rect(this.ctx)
            .at(0, this.canvas.height - height)
            .size(this.canvas.width, height)
            .color("#0C0C0C");

        this.initSavedGates();
    }

    update() {}

    draw() {
        this.rect.draw();
    }
}

export default Toolbox;
