import Rect from "./rect.js";
import Mouse from "../input/mouse.js";

class Button {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.rect = new Rect(this.ctx);
        this.innerText = this.rect.innerText;

        this.debugName = "Button";

        Mouse.addLeftClickDownEvent(this.onLeftClickDown.bind(this), this.rect);
        Mouse.addLeftClickUpEvent(this.onLeftClickUp.bind(this), this.rect);
        Mouse.addRightClickDownEvent(this.onRightClickDown.bind(this), this.rect);
        Mouse.addRightClickUpEvent(this.onRightClickUp.bind(this), this.rect);
    }

    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.rect.x, y: this.rect.y }; // Return the current position if no arguments are passed
        this.rect.at(x, y);
        return this;
    }

    center(x = null, y = null) {
        if (x === null && y === null) return { x: this.rect.x + this.rect.width / 2, y: this.rect.y + this.rect.height / 2 }; // Return the current center if no arguments are passed
        this.rect.center(x, y);
        return this;
    }

    color(rectColor = null, lineColor = null) {
        this.rect.color(rectColor, lineColor);
        return this;
    }

    size(width = null, height = null, lineWidth = null) {
        this.rect.size(width, height, lineWidth);
        return this;
    }

    draw() {
        this.rect.draw();
    }

    onLeftClickDown({ x, y, button }) {}

    onLeftClickUp({ x, y, button }) {}

    onRightClickDown({ x, y, button }) {}

    onRightClickUp({ x, y, button }) {}
}

export default Button;
