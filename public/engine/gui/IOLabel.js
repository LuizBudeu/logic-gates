import Settings from "../settings.js";
import Text from "../UIComponents/text.js";
import Rect from "../UIComponents/rect.js";
import Bridge from "../bridge.js";
import Mouse from "../input/mouse.js";

class IOLabel {
    constructor(ctx, io) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.io = io;

        this.name = io.type === "input" ? "in" : "out";
        const prefix = io.isGlobal() ? "G." : "";
        this.name = prefix + this.name + io.IOId;

        this.rect = new Rect(ctx);
        this.text = new Text(ctx);
    }

    start() {
        const rectWidth = 40; // TODO: make size adjustable with text size
        const rectHeight = 20;

        const offset = this.getOffset();
        this.rect.at(this.io.circle.x + offset, this.io.circle.y - rectHeight / 2);
        this.rect.size(rectWidth, rectHeight).color(Settings.IO_LABEL_RECT_COLOR);

        this.text.content(this.name).style("Arial", Settings.IO_LABEL_FONT_SIZE, "#fff").centerInRect(this.rect);
    }

    update() {
        const rectWidth = 40; // TODO: make size adjustable with text size
        const rectHeight = 20;

        const offset = this.getOffset();
        this.rect.at(this.io.circle.x + offset, this.io.circle.y - rectHeight / 2);
        this.text.centerInRect(this.rect);
    }

    draw() {
        this.rect.draw();
        this.text.draw();
    }

    getOffset() {
        let offset;
        if (this.io.isGlobal()) {
            offset = this.io.type === "input" ? 30 : -70;
        } else {
            offset = this.io.type === "input" ? -55 : 15;
        }
        return offset;
    }
}

export default IOLabel;
