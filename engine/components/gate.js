import Rect from "../ui/rect.js";
import Settings from "../settings.js";
import Input from "./input.js";
import Output from "./output.js";
import Mouse from "../input/mouse.js";
import WiringManager from "../managers/wiringManager.js";
import DeleteManager from "../managers/deleteManager.js";
import Bridge from "../bridge.js";

class Gate {
    constructor(ctx, logic) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.logic = logic;

        this.debugName = `${this.logic.name}_Gate`;

        // Handle deletion
        Mouse.addLeftClickDownEvent(this.handleLeftClickDown.bind(this));
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
        this.inputs = [new Input(this.ctx, false, debugName + "_1"), new Input(this.ctx, false, debugName + "_2")]; // TODO add possibility of multiple inputs
        this.inputs[0].circle
            .at(rectPos.x, rectPos.y + this.rect.width / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.inputs[1].circle
            .at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        this.output = new Output(this.ctx, debugName + "_1");
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
        this.output.propagate();
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
                DeleteManager.deleteGameObject(this);
                this.inputs.forEach((input) => {
                    DeleteManager.deleteGameObject(input);
                });
                DeleteManager.deleteGameObject(this.output);
            }
        }
    }
}

export default Gate;
