import Rect from "../ui/rect.js";
import Settings from "../settings.js";
import Input from "./input.js";
import Output from "./output.js";
import Mouse from "../input/mouse.js";
import Vector from "../utils/vector.js";

class Gate {
    constructor(ctx, logic) {
        this.ctx = ctx;
        this.logic = logic;

        // Dragging properties
        this.isDragging = false;
        this.XDx = 0;
        this.XDy = 0;
        this.dragStart = { x: 0, y: 0 };
    }

    start() {
        this.rect = new Rect(this.ctx)
            .at(Settings.CANVAS_WIDTH / 2 - 50, Settings.CANVAS_HEIGHT / 2 - 50)
            .size(100, 100)
            .color("#7a130d");

        this.rect.innerText.style("Arial", 20, "#fff").content(this.logic.name);

        // Center the inner text
        const textWidth = this.ctx.measureText(this.rect.innerText.textContent).width;
        const textHeight = this.rect.innerText.fontSize;
        this.rect.innerText.at(this.rect.x + this.rect.width / 2 - textWidth / 2, this.rect.y + this.rect.height / 2 + textHeight / 2);

        // Position the inputs and output
        const rectPos = this.rect.at();
        this.inputs = [new Input(this.ctx), new Input(this.ctx)]; // TODO add possibility of multiple inputs
        this.inputs[0].circle
            .at(rectPos.x, rectPos.y + this.rect.width / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.inputs[1].circle
            .at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        this.output = new Output(this.ctx);
        this.output.circle
            .at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        Mouse.addLeftClickDraggingEvent(this.handleDragging.bind(this), this.rect);
    }

    update(deltaTime) {
        this.compute();
    }

    draw() {
        this.rect.draw();
        this.inputs.forEach((input) => {
            input.circle.draw();
        });
        this.output.circle.draw();
    }

    compute() {
        const result = this.logic(this.inputs[0].value(), this.inputs[1].value());
        this.output.value(result);
    }

    handleLeftClick({ x, y, button }) {
        // Check if the mouse is inside the gate
        if (x >= this.rect.x && x <= this.rect.x + this.rect.width && y >= this.rect.y && y <= this.rect.y + this.rect.height) {
            this.isDragging = true;
            this.dragStartX = x - this.rect.x;
            this.dragStartY = y - this.rect.y;
        }
    }

    handleLeftRelease() {
        this.isDragging = false;
    }

    handleMouseMove({ x, y }) {
        if (this.isDragging) {
            // Move the gate
            this.rect.at(x - this.dragStartX, y - this.dragStartY);

            // Move the inner text
            const textWidth = this.ctx.measureText(this.rect.innerText.textContent).width;
            const textHeight = this.rect.innerText.fontSize;
            this.rect.innerText.at(this.rect.x + this.rect.width / 2 - textWidth / 2, this.rect.y + this.rect.height / 2 + textHeight / 2);

            // Move the inputs and output
            const rectPos = this.rect.at();
            this.inputs[0].circle.at(rectPos.x, rectPos.y + this.rect.width / 3);
            this.inputs[1].circle.at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3);
            this.output.circle.at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2);
        }
    }

    handleDragging({ deltaX, deltaY }) {
        // Move the gate
        this.rect.x += deltaX;
        this.rect.y += deltaY;

        // Move the inner text
        const textWidth = this.ctx.measureText(this.rect.innerText.textContent).width;
        const textHeight = this.rect.innerText.fontSize;
        this.rect.innerText.at(this.rect.x + this.rect.width / 2 - textWidth / 2, this.rect.y + this.rect.height / 2 + textHeight / 2);

        // Move the inputs and output
        const rectPos = this.rect.at();
        this.inputs[0].circle.at(rectPos.x, rectPos.y + this.rect.width / 3);
        this.inputs[1].circle.at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3);
        this.output.circle.at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2);
    }
}

export default Gate;
