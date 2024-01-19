import Settings from "../settings.js";
import Mouse from "../input/mouse.js";
import Bridge from "../bridge.js";
import DeleteManager from "../managers/deleteManager.js";
import WiringManager from "../managers/wiringManager.js";
import CircuitManager from "../managers/circuitManager.js";

class Wire {
    constructor(ctx, connection) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.connection = connection;

        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.lineColor = "#000"; // Default color is black
        this.lineWidth = Settings.WIRE_WIDTH; // Default line width is 2
        this.dotRadius = Settings.WIRE_DOT_RADIUS; // Default dot radius is 3

        this.debugName = "Wire";

        // Handle deletion
        Mouse.addLeftClickDownEvent(this.handleLeftClickDown.bind(this));
    }

    start() {}

    update(deltaTime) {}

    connect(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        return this;
    }

    color(color = null) {
        if (color) this.lineColor = color;
        return this;
    }

    draw() {
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineWidth = this.lineWidth;

        // Draw the wire
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.endX, this.endY);
        this.ctx.stroke();

        // Draw dots at each end
        this.drawDot(this.startX, this.startY);
        this.drawDot(this.endX, this.endY);

        return this;
    }

    drawDot(x, y) {
        this.ctx.fillStyle = this.lineColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.dotRadius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    handleLeftClickDown() {
        // Hitbox is slightly larger than the wire
        const hitBoxLineWidth = 20;

        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY + hitBoxLineWidth);
        this.ctx.lineTo(this.startX, this.startY - hitBoxLineWidth);
        this.ctx.lineTo(this.endX, this.endY - hitBoxLineWidth);
        this.ctx.lineTo(this.endX, this.endY + hitBoxLineWidth);
        this.ctx.closePath();

        const deleteMode = Settings.SCENE_MODE === Settings.SCENE_MODE_OPTIONS.DELETE;
        if (deleteMode) {
            const mousePos = Mouse.getPosition();
            if (this.ctx.isPointInPath(mousePos.x, mousePos.y)) {
                CircuitManager.removeConnection(this.connection);
                WiringManager.removeWiring(this.connection);
                DeleteManager.deleteGameObject(this);
            }
        }
    }
}

export default Wire;
