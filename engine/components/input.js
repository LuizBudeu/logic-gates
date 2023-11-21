import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import Scene from "../scene.js";
import Signal from "../signal.js";

class Input {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.circle = new Circle(this.ctx);
        this._value = false;
        this.isSelected = false;

        // Selection circle
        this.selectionCircle = new Circle(this.ctx).color("#00F");

        // Event listener for right-click (contextmenu) to select/deselect the input
        this.ctx.canvas.addEventListener("contextmenu", this.handleRightClick.bind(this));
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

    handleRightClick(event) {
        event.preventDefault(); // Prevent the default context menu

        const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top;

        // Check if the right-click is within the circle
        const distance = Math.sqrt((mouseX - this.circle.x) ** 2 + (mouseY - this.circle.y) ** 2);
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

export default Input;
