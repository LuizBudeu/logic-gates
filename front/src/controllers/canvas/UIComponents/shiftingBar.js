import Text from "./text.js";
import Rect from "./rect.js";
import Settings from "../settings.js";

export default class ShiftingBar {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.backgroundRect = null;

        this._allOptions = [];
        this.visibleOptions = [];
        this.startIndex = null;
        this.endIndex = null;
        this._visibleLength = 10;

        this.debugName = "ShiftingBar";
    }

    start() {
        this.apply();
    }

    update() {}

    allOptions(options = null) {
        if (options === null) return this._allOptions;

        this._allOptions = options;
        return this;
    }

    addOption(option) {
        this._allOptions.push(option);
    }

    visibleLength(value = null) {
        if (value === null) return this._visibleLength;

        this._visibleLength = value;
        return this;
    }

    shiftLeft() {
        this.startIndex = (this.startIndex - 1 + this._allOptions.length) % this._allOptions.length;
        this.apply(this.startIndex);
    }

    shiftRight() {
        this.startIndex = (this.startIndex + 1) % this._allOptions.length;
        this.apply(this.startIndex);
    }

    apply(start_index = 0) {
        this.startIndex = start_index;

        if (this._allOptions.length <= this._visibleLength) {
            // If there are fewer items than the visible length, show all items
            this.visibleOptions = this._allOptions;
        } else {
            this.endIndex = (this.startIndex + this._visibleLength) % this._allOptions.length;

            if (this.startIndex + this._visibleLength <= this._allOptions.length) {
                this.visibleOptions = this._allOptions.slice(this.startIndex, this.startIndex + this._visibleLength);
            } else {
                // Wrap-around case
                const endSlice = this._allOptions.slice(this.startIndex);
                const startSlice = this._allOptions.slice(0, this._visibleLength - endSlice.length);
                this.visibleOptions = endSlice.concat(startSlice);
            }
        }

        const notVisible = this._allOptions.filter((x) => !this.visibleOptions.includes(x));
        notVisible.forEach((savedGate) => {
            savedGate.at(-100, -100);
        });
    }

    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.x, y: this.y }; // Return the current position if no arguments are passed
        if (x !== null) this.x = x;
        if (y !== null) this.y = y;
        return this;
    }

    center(x = null, y = null) {
        if (x === null && y === null) return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; // Return the current center if no arguments are passed
        if (x) this.x = x - this.width / 2;
        if (y) this.y = y - this.height / 2;
        return this;
    }

    size(width = null, height = null) {
        if (width === null && height === null) return { width: this.width, height: this.height };
        if (width) this.width = width;
        if (height) this.height = height;
        return this;
    }

    draw() {
        const shiftingBarPos = this.at();
        let lastSavedGateX = 0;

        this.visibleOptions.forEach((savedGate) => {
            const gateX = shiftingBarPos.x + lastSavedGateX + Settings.SAVED_GATE_BASE_MARGIN.x;
            const gateY = shiftingBarPos.y + Settings.SAVED_GATE_BASE_MARGIN.y;

            lastSavedGateX += savedGate.rect.width + Settings.SAVED_GATE_BASE_MARGIN.x;

            savedGate.rect.at(gateX, gateY);
            savedGate.rect.innerText.centerInRect(savedGate.rect);
            savedGate.draw();
        });
    }
}
