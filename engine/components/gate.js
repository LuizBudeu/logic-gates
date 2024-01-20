import Rect from "../ui/rect.js";
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

class Gate extends Component {
    constructor(
        ctx,
        logic,
        ios = {
            inputs: 2,
            outputs: 1,
        }
    ) {
        super(`${logic.name}_Gate`);

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.logic = logic;

        // Handle deletion
        Mouse.addLeftClickDownEvent(this.handleLeftClickDown.bind(this));

        // Add to the circuit
        CircuitManager.circuit.components.push(this);
    }

    start() {
        this.rect = new Rect(this.ctx)
            .at(Settings.CANVAS_WIDTH / 2 - 50, Settings.CANVAS_HEIGHT / 2 - 50)
            .size(100, 100)
            .color("#7a130d");

        this.rect.innerText.style("Arial", 20, "#fff").content(this.logic.name);
        this.rect.innerText.centerInRect(this.rect);

        // Position the inputs and output
        const debugName = `${this.logic.name}_Gate`;

        const rectPos = this.rect.at();
        this.inputs = [new Input(this.ctx, false, debugName + "_1", this), new Input(this.ctx, false, debugName + "_2", this)]; // TODO add possibility of multiple inputs
        this.inputs[0].circle
            .at(rectPos.x, rectPos.y + this.rect.width / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.inputs[1].circle
            .at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        this.output = new Output(this.ctx, debugName + "_1", this);
        this.output.circle
            .at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        // Place the inputs and output in the scene
        Bridge.sceneInstance.place(this.inputs[0]);
        Bridge.sceneInstance.place(this.inputs[1]);
        Bridge.sceneInstance.place(this.output);

        Mouse.addLeftClickDraggingEvent(this.handleDragging.bind(this), this.rect);
    }

    update(deltaTime) {}

    draw() {
        this.rect.draw();
    }

    compute() {
        const result = this.logic(this.inputs[0].value(), this.inputs[1].value());
        this.output.value(result);
    }

    handleDragging({ deltaX, deltaY }) {
        // Move the gate
        this.rect.x += deltaX;
        this.rect.y += deltaY;

        // Move the inner text
        this.rect.centerInnerText();

        // Move the inputs and output
        const rectPos = this.rect.at();
        this.inputs[0].circle.at(rectPos.x, rectPos.y + this.rect.width / 3);
        this.inputs[1].circle.at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3);
        this.output.circle.at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2);

        // Move the wires
        WiringManager.moveWiring(this.inputs[0]);
        WiringManager.moveWiring(this.inputs[1]);
        WiringManager.moveWiring(this.output);
    }

    handleLeftClickDown() {
        this.ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.ctx.closePath();

        const deleteMode = Settings.SCENE_MODE === Settings.SCENE_MODE_OPTIONS.DELETE;
        if (deleteMode) {
            const mousePos = Mouse.getPosition();
            if (this.ctx.isPointInPath(mousePos.x, mousePos.y)) {
                // Delete inputs, output, and connections
                this.inputs.forEach((input) => {
                    input.IOConnections.forEach((connection) => {
                        CircuitManager.removeConnection(connection);
                    });
                    Bridge.sceneInstance.remove(input.selectionCircle, 0);
                    DeleteManager.deleteGameObject(input);
                });

                this.output.IOConnections.forEach((connection) => {
                    CircuitManager.removeConnection(connection);
                });
                Bridge.sceneInstance.remove(this.output.selectionCircle, 0);
                DeleteManager.deleteGameObject(this.output);

                // Delete the gate
                DeleteManager.deleteGameObject(this);
            }
        }
    }
}

export default Gate;
