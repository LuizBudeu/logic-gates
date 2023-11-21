import Circle from "../ui/circle.js";
import Settings from "../settings.js";

class Input {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.circle = new Circle(this.ctx);
        this._value = false;
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
}

export default Input;
