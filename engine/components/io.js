import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import Mouse from "../input/mouse.js";
import Signal from "../signal.js";

class IO {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.circle = new Circle(this.ctx);
        this._value = false;

        // Selection circle
        this.selectionCircle = new Circle(this.ctx).color("#00F");

        // Event listener for selecting the IO
        Mouse.addRightClickEvent(this.handleRightClick.bind(this));
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

    handleRightClick({ x, y, button }) {
        // Check if the right-click is within the circle
        const distance = Math.sqrt((x - this.circle.x) ** 2 + (y - this.circle.y) ** 2);
        if (distance <= this.circle.radius()) {
            this.isSelected = !this.isSelected; // Toggle the selection state

            if (this.isSelected) {
                this.selectionCircle.at(this.circle.x, this.circle.y).radius(this.circle.radius() + 5);
                Signal.addObjectToScene(this.selectionCircle);
            } else {
                Signal.removeObjectFromScene(this.selectionCircle);
            }
        }
    }
}

export default IO;
