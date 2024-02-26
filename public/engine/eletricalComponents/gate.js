import Rect from "../UIComponents/rect.js";
import Settings from "../settings.js";
import Input from "./input.js";
import Output from "./output.js";
import Mouse from "../input/mouse.js";
import WiringManager from "../managers/wiringManager.js";
import DeleteManager from "../managers/deleteManager.js";
import SelectionManager from "../managers/selectionManager.js";
import Bridge from "../bridge.js";
import Component from "./component.js";
import CircuitManager from "../managers/circuitManager.js";
import { getAllNumbersFromString } from "../utils/utils.js";

class Gate extends Component {
    constructor(
        ctx,
        logic,
        name,
        ios = {
            inputs: 2,
            outputs: 1,
        }
    ) {
        super(`${name}_Gate`);

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.logic = logic;
        this.ios = ios;
        this.name = name;

        this.inputs = [];
        this.outputs = [];

        // Handle deletion
        Mouse.addLeftClickDownEvent(this.handleLeftClickDown.bind(this));

        // Add to the circuit
        CircuitManager.addComponent(this);
    }

    start() {
        this.rect = new Rect(this.ctx)
            .at(Settings.CANVAS_WIDTH / 2 - 50, Settings.CANVAS_HEIGHT / 2 - 50)
            .size(100, 100)
            .color("#7a130d");

        this.rect.innerText.style("Arial", 20, "#fff").content(this.name);
        this.rect.innerText.centerInRect(this.rect);

        // Position the inputs and output
        const debugName = `${this.name}_Gate`;

        for (let i = 0; i < this.ios.inputs; i++) {
            const rectPos = this.calculateIOPosition(i, "input");

            const input = new Input(this.ctx, false, debugName + `_${i}`, this, i);
            input.circle.at(rectPos.x, rectPos.y).radius(Settings.COMPONENT_IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

            this.inputs.push(input);
            Bridge.sceneInstance.place(input);

            input.IOId = i;
        }

        for (let i = 0; i < this.ios.outputs; i++) {
            const rectPos = this.calculateIOPosition(i, "output");

            const output = new Output(this.ctx, debugName + `_${i}`, this, i);
            output.circle.at(rectPos.x, rectPos.y).radius(Settings.COMPONENT_IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

            this.outputs.push(output);
            Bridge.sceneInstance.place(output);

            output.IOId = i;
        }

        Mouse.addLeftClickDraggingEvent(this.handleDragging.bind(this), this.rect);
    }

    update(deltaTime) {}

    draw() {
        this.rect.draw();
    }

    compute() {
        const result = this.logic(...this.inputs.map((input) => input.value()));

        this.outputs.forEach((output) => {
            const outputIndex = getAllNumbersFromString(output.debugName);
            output.value(result[`output${outputIndex}`]);
        });
    }

    calculateIOPosition(index, IOtype) {
        const rectPos = this.rect.at();
        if (IOtype === "input") {
            return {
                x: rectPos.x,
                y: rectPos.y + (this.rect.width * (index + 1)) / (this.ios.inputs + 1),
            };
        } else {
            return {
                x: rectPos.x + this.rect.width,
                y: rectPos.y + this.rect.height / (this.ios.outputs + 1),
            };
        }
    }

    handleDragging({ deltaX, deltaY }) {
        // Move the gate
        this.rect.x += deltaX;
        this.rect.y += deltaY;

        // Move the inner text
        this.rect.centerInnerText();

        // Move the inputs and output
        const rectPos = this.rect.at();
        this.inputs.forEach((input, index) => {
            const IOPos = this.calculateIOPosition(index, "input");
            input.circle.at(IOPos.x, IOPos.y);
        });
        this.outputs.forEach((output, index) => {
            const IOPos = this.calculateIOPosition(index, "output");
            output.circle.at(IOPos.x, IOPos.y);
        });

        // Move the wires
        this.inputs.forEach((input) => {
            WiringManager.moveWiring(input);
        });
        this.outputs.forEach((output) => {
            WiringManager.moveWiring(output);
        });
    }

    handleLeftClickDown() {
        this.ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.ctx.closePath();

        const deleteMode = Settings.SCENE_MODE === Settings.SCENE_MODE_OPTIONS.DELETE;
        if (deleteMode) {
            const mousePos = Mouse.getPosition();
            if (this.ctx.isPointInPath(mousePos.x, mousePos.y)) {
                SelectionManager.selectedIOs = [];

                this.delete();
            }
        }
    }

    delete() {
        // Delete inputs, output, and connections
        this.inputs.forEach((input) => {
            input.IOConnections.forEach((connection) => {
                CircuitManager.removeConnection(connection);
            });
            Bridge.sceneInstance.remove(input.selectionCircle, 0);
            CircuitManager.removeComponent(input);
            DeleteManager.deleteGameObject(input);
        });

        this.outputs.forEach((output) => {
            output.IOConnections.forEach((connection) => {
                CircuitManager.removeConnection(connection);
            });
            Bridge.sceneInstance.remove(output.selectionCircle, 0);
            CircuitManager.removeComponent(output);
            DeleteManager.deleteGameObject(output);
        });

        // Delete the gate
        DeleteManager.deleteGameObject(this);
        CircuitManager.removeComponent(this);
    }

    serialize() {
        return {
            type: "gate",
            name: this.name,
            circuitId: `${this.circuitId}`,
            inputs: this.inputs.map((input) => input.serialize()),
            outputs: this.outputs.map((output) => output.serialize()),
        };
    }
}

export default Gate;
