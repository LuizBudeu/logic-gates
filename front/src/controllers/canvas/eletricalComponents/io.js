import Circle from "../UIComponents/circle.js";
import Settings from "../settings.js";
import Mouse from "../input/mouse.js";
import Bridge from "../bridge.js";
import SelectionManager from "../managers/selectionManager.js";
import CircuitManager from "../managers/circuitManager.js";
import DeleteManager from "../managers/deleteManager.js";
import BaseComponent from "./baseComponent.js";
import Text from "../UIComponents/text.js";

class IO extends BaseComponent {
    constructor(ctx, debugName = "", gate = null) {
        super(debugName);

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.gate = gate;

        this.circle = new Circle(this.ctx);
        this._value = false;
        this.isSelected = false;
        this.type = null;
        this.IOId = null;

        this.IOConnections = [];

        // Selection circle
        this.selectionCircle = new Circle(this.ctx).color(Settings.SELECTION_COLOR);

        // Event listener for selecting the IO
        Mouse.addRightClickDownEvent(this.handleRightClick.bind(this));

        // Add to the circuit
        CircuitManager.addComponent(this);
    }

    start() {}

    update(deltaTime) {}

    draw() {
        this.circle.draw();
    }

    value(value = null) {
        if (value === null) return this._value;
        this._value = value;
        if (value) {
            this.circle.color(Settings.COMPONENT_IO_ON_COLOR);
        } else {
            this.circle.color(Settings.COMPONENT_IO_OFF_COLOR);
        }
    }

    propagate(io) {
        io?.value(this.value());
    }

    handleRightClick({ x, y, button }) {
        // Check if the right-click is within the circle
        const distance = Math.sqrt((x - this.circle.x) ** 2 + (y - this.circle.y) ** 2);
        if (distance <= this.circle.radius()) {
            this.isSelected = !this.isSelected; // Toggle the selection state

            if (this.isSelected) {
                SelectionManager.selectIO(this);
            } else {
                SelectionManager.deselectIO(this);
            }
        }
    }

    isGlobal() {
        return this.gate === null;
    }

    isUpstream(connection) {
        return connection.upstream === this;
    }

    delete() {
        this.IOConnections.forEach((connection) => {
            CircuitManager.removeConnection(connection);
        });
        DeleteManager.deleteGameObject(this.selectionCircle, Settings.BACKGROUND_LAYER);
        CircuitManager.removeComponent(this);
        DeleteManager.deleteGameObject(this);
    }

    serialize() {
        if (!this.isGlobal()) {
            return {
                IOId: `${this.IOId}`,
            };
        } else {
            return {
                type: this.type,
                circuitId: `${this.circuitId}`,
                isGlobal: true,
                IOId: `${this.IOId}`,
            };
        }
    }
}

export default IO;
