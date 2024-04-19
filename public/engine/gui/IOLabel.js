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
        this.name = io.isGlobal() ? "G." : "" + this.name;
        this.name += io.IOId;

        this.rect = new Rect(ctx);
        this.text = new Text(ctx);
    }

    start() {
        const offset = this.io.type === "input" ? 130 : -130;
        this.rect
            .at(this.io.x + offset, this.io.y)
            .size(100, 50)
            .color(Settings.IO_LABEL_RECT_COLOR);

        this.text.content(this.name).style("Arial", Settings.IO_LABEL_FONT_SIZE, "#fff").centerInRect(this.rect);
    }

    update() {}

    draw() {
        this.rect.draw();
        this.text.draw();
    }
}

export default IOLabel;
