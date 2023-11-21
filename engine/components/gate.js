import Rect from "../ui/rect.js";
import Settings from "../settings.js";
import Input from "./input.js";
import Output from "./output.js";

class Gate {
    constructor(ctx, logic) {
        this.ctx = ctx;
        this.logic = logic;

        this.rect = new Rect(this.ctx)
            .at(Settings.CANVAS_WIDTH / 2 - 50, Settings.CANVAS_HEIGHT / 2 - 50)
            .size(100, 100)
            .color("#7a130d");

        this.rect.innerText.style("Arial", 20, "#fff").content(logic.name);

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

        // Dragging properties
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Event listeners for dragging
        document.addEventListener("mousedown", this.handleMouseDown.bind(this));
        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));
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

    handleMouseDown(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Check if the mouse is inside the gate
        if (mouseX >= this.rect.x && mouseX <= this.rect.x + this.rect.width && mouseY >= this.rect.y && mouseY <= this.rect.y + this.rect.height) {
            this.isDragging = true;
            this.dragStartX = mouseX - this.rect.x;
            this.dragStartY = mouseY - this.rect.y;
        }
    }

    handleMouseMove(event) {
        if (this.isDragging) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Move the gate
            this.rect.at(mouseX - this.dragStartX, mouseY - this.dragStartY);

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

    handleMouseUp() {
        this.isDragging = false;
    }
}

export default Gate;
