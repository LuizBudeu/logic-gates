import Circle from "../ui/circle.js";
import Settings from "../settings.js";

class Input {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.circle = new Circle(this.ctx);
        this.value = false;
    }

    setValue(value) {
        this.value = value;
        if (value) {
            this.circle.circleColor = Settings.COMPONENT_IO_ON_COLOR;
        } else {
            this.circle.circleColor = Settings.COMPONENT_IO_OFF_COLOR;
        }
    }
}

export default Input;
