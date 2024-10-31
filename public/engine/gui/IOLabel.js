import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Mouse from "../input/mouse.js";
import Button from "../UIComponents/button.js";

class IOLabel extends Button {
    constructor(ctx, io) {
        /** @type {CanvasRenderingContext2D} */
        super(ctx);
        this.io = io;

        this.name = io.type === "input" ? "in" : "out";
        const prefix = io.isGlobal() ? "G." : "";
        this.name = prefix + this.name + io.IOId;
    }

    start() {
        const rectWidth = 40; // TODO: make size adjustable with text size
        const rectHeight = 20;

        const offset = this.getOffset();
        this.rect.at(this.io.circle.x + offset, this.io.circle.y - rectHeight / 2);
        this.rect.size(rectWidth, rectHeight).color(Settings.IO_LABEL_RECT_COLOR);

        this.rect.innerText.content(this.name).style("Arial", Settings.IO_LABEL_FONT_SIZE, "#fff").centerInRect(this.rect);
    }

    update() {
        if (Settings.IS_SHOWING_IO_LABELS) {
            const rectWidth = 40; // TODO: make size adjustable with text size
            const rectHeight = 20;

            const offset = this.getOffset();
            this.rect.at(this.io.circle.x + offset, this.io.circle.y - rectHeight / 2);
            this.rect.innerText.centerInRect(this.rect);
        }
    }

    draw() {
        if (Settings.IS_SHOWING_IO_LABELS) {
            this.rect.draw();
        }
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

    onLeftClickUp() {
        if (Settings.IS_SHOWING_IO_LABELS) {
            // Prompt user for IO label
            const newLabel = prompt("Enter IO label:", this.rect.innerText.content());

            // Check if user cancelled or is empty
            if (newLabel === null || newLabel === "") {
                return;
            }

            this.name = newLabel;
            this.rect.innerText.content(newLabel);
        }
    }
}

export default IOLabel;
