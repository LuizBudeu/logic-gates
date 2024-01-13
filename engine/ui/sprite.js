/**
 * Represents an image element to be drawn on a canvas.
 * @class
 */
class Sprite {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    constructor(ctx, source = "") {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.image = new Image();
        this.image.src = source;
        this.x = 100;
        this.y = 100;
        this.width = 50;
        this.height = 50;
    }

    /**
     * Set or get the position of the image.
     * @param {number} [x=null] - The x-coordinate.
     * @param {number} [y=null] - The y-coordinate.
     * @returns {Sprite|Object} - If no arguments are passed, returns the current position. Otherwise, returns the Sprite instance.
     */
    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.x, y: this.y }; // Return the current position if no arguments are passed
        if (x) this.x = x;
        if (y) this.y = y;
        return this;
    }

    /**
     * Set or get the size of the image.
     * @param {number} [width=null] - The width of the image.
     * @param {number} [height=null] - The height of the image.
     * @returns {Sprite|Object} - If no arguments are passed, returns the current size. Otherwise, returns the Sprite instance.
     */
    size(width = null, height = null) {
        if (width === null && height === null) return { width: this.width, height: this.height }; // Return the current size if no arguments are passed
        if (width) this.width = width;
        if (height) this.height = height;
        return this;
    }

    /**
     * Set or get the source of the image.
     * @param {string} [src=null] - The image source.
     * @returns {Sprite} - The Sprite instance.
     */
    source(src = null) {
        if (src) this.image.src = src;
        return this;
    }

    /**
     * Draw the image on the canvas.
     */
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    /**
     * Center the image horizontally and vertically inside a rectangle.
     * @param {Rect} [rect] - The rectangle.
     * @returns {Sprite} - The Sprite instance.
     */
    centerInRect(rect) {
        const centerX = rect.x + rect.width / 2 - this.width / 2;
        const centerY = rect.y + rect.height / 2 - this.height / 2;

        this.at(centerX, centerY);
        return this;
    }
}

export default Sprite;
