import Rect from "../UIComponents/rect.js";
import Settings from "../settings.js";
import Input from "./input.js";
import Output from "./output.js";
import Mouse from "../input/mouse.js";
import WiringManager from "../managers/wiringManager.js";
import DeleteManager from "../managers/deleteManager.js";
import SelectionManager from "../managers/selectionManager.js";
import Bridge from "../bridge.js";
import BaseComponent from "./baseComponent.js";
import CircuitManager from "../managers/circuitManager.js";

class Gate extends BaseComponent {
    constructor(ctx, logicFunctionStr, name, ios) {
        super(`${name}_Gate`);

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.logicFunction = eval(logicFunctionStr);
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
        const rectSize = this.calculateSize();

        this.rect = new Rect(this.ctx)
            .at(Settings.CANVAS_WIDTH / 2 - 50, Settings.CANVAS_HEIGHT / 2 - 50)
            .size(rectSize.width + 20, rectSize.height)
            .color(Settings.GATE_COLOR);

        this.rect.innerText.style("Arial", Settings.GATE_NAME_FONT_SIZE, "#fff").content(this.name);
        this.rect.innerText.centerInRect(this.rect);

        const debugName = `${this.name}_Gate`;

        console.log(this.ios);

        // Position the inputs and output
        this.ios.inputs.forEach((input, index) => {
            const i = index;
            const rectPos = this.calculateIOPosition(i, "input");

            const inputComponent = new Input(this.ctx, false, debugName + `_${i}`, this, input.IOLabel);
            inputComponent.circle.at(rectPos.x, rectPos.y).radius(Settings.COMPONENT_IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

            this.inputs.push(inputComponent);

            inputComponent.IOId = i;
            Bridge.sceneInstance.place(inputComponent, Settings.FOREGROUND_LAYER, true);
        });

        this.ios.outputs.forEach((output, index) => {
            const i = index;
            const rectPos = this.calculateIOPosition(i, "output");

            const outputComponent = new Output(this.ctx, debugName + `_${i}`, this, output.IOLabel);
            outputComponent.circle.at(rectPos.x, rectPos.y).radius(Settings.COMPONENT_IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);

            this.outputs.push(outputComponent);

            outputComponent.IOId = i;
            Bridge.sceneInstance.place(outputComponent, Settings.FOREGROUND_LAYER, true);
        });

        Mouse.addLeftClickDraggingEvent(this.handleDragging.bind(this), this.rect);
    }

    update(deltaTime) {}

    draw() {
        this.rect.draw();
    }

    compute() {
        const result = this.logicFunction.compute(...this.inputs.map((input) => input.value()));

        this.outputs.forEach((output) => {
            output.value(result[`output${output.IOId}`]);
        });
    }

    calculateIOPosition(index, IOtype) {
        const rectPos = this.rect.at();
        if (IOtype === "input") {
            return {
                x: rectPos.x,
                y: rectPos.y + (this.rect.height * (index + 1)) / (this.ios.inputs.length + 1),
            };
        } else {
            return {
                x: rectPos.x + this.rect.width,
                y: rectPos.y + (this.rect.height * (index + 1)) / (this.ios.outputs.length + 1),
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
            input.delete();
        });

        this.outputs.forEach((output) => {
            output.delete();
        });

        // Delete the gate
        CircuitManager.removeComponent(this);
        DeleteManager.deleteGameObject(this);
    }

    calculateSize() {
        const baseHeight = Settings.GATE_BASE_HEIGHT;
        const baseWidth = Settings.GATE_BASE_WIDTH;

        const height = baseHeight + Settings.GATE_BASE_HEIGHT_MULTIPLIER * (Math.max(this.ios.inputs.length, this.ios.outputs.length) - 1);
        const textWidth = this.ctx.measureText(this.name).width;
        const padding = 30;
        const width = Math.max(baseWidth, textWidth + padding);

        return {
            height,
            width,
        };
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
