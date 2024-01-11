import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import Mouse from "../input/mouse.js";
import Signal from "../signal.js";
import SelectionManager from "../managers/selectionManager.js";
import gameObject from "../baseScript.js";
import Connection from "./connection.js";

class IO extends gameObject {
    constructor(ctx, debugName = "") {
        super(ctx);

        this.debugName = debugName;

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.circle = new Circle(this.ctx);
        this._value = false;
        this.isSelected = false;

        this.IOConnections = [];

        // Selection circle
        this.selectionCircle = new Circle(this.ctx).color("#00F");

        // Event listener for selecting the IO
        Mouse.addRightClickDownEvent(this.handleRightClick.bind(this));
    }

    start() {}

    update(deltaTime) {
        this.propagate();
    }

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

    connect(io) {
        const connection = new Connection(this, io);
        this.IOConnections.push(connection);
        io.IOConnections.push(connection);
    }

    disconnect(io) {
        this.IOConnections = this.IOConnections.filter((connection) => connection.io1 !== io && connection.io2 !== io);
        io.IOConnections = io.IOConnections.filter((connection) => connection.io1 !== this && connection.io2 !== this);
    }

    propagate() {
        this.IOConnections.forEach((connection) => {
            if (connection.io1 === this) {
                connection.io2.value(this.value());
            } else {
                connection.io1.value(this.value());
            }
        });
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
}

export default IO;
