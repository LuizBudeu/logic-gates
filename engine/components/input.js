import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Mouse from "../input/mouse.js";
import IO from "./io.js";

class Input extends IO {
    constructor(ctx, interactive = false, debugName = "") {
        debugName += "_Input";
        super(ctx, debugName);

        if (interactive) {
            // Event listener for turning input on and off
            Mouse.addLeftClickDownEvent(this.handleLeftClick.bind(this));
        }
    }

    handleLeftClick({ x, y, button }) {
        // Check if the left-click is within the circle
        const distance = Math.sqrt((x - this.circle.x) ** 2 + (y - this.circle.y) ** 2);
        if (distance <= this.circle.radius()) {
            // Toggle the value
            this.value(!this.value());
        }
    }
}

export default Input;
