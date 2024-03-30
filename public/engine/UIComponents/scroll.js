import Text from "./text.js";
import Settings from "./settings.js";

class Scroll {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.scrollbars = {};

        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.rectColor = "#000"; // Default color is black
        this.lineWidth = 1; // Default line width is 1
        this.lineColor = "#000"; // Default line color is black
    }

    start() {}

    update() {}

    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.x, y: this.y }; // Return the current position if no arguments are passed
        if (x !== null) this.x = x;
        if (y !== null) this.y = y;
        return this;
    }


    size(width = null, height = null, lineWidth = null) {
        if (width === null && height === null) return { width: this.width, height: this.height };
        if (width) this.width = width;
        if (height) this.height = height;
        if (lineWidth) this.lineWidth = lineWidth;
        return this;
    }

    color(rectColor = null, lineColor = null) {
        if (rectColor === null && lineColor === null)
            return {
                rectColor: this.rectColor,
                lineColor: this.lineColor,
            };
        if (rectColor) this.rectColor = rectColor;
        if (lineColor) this.lineColor = lineColor;
        return this;
    }

    scrollbars() {        
        // initial position
        this.scrollbars.left = 0;
        this.scrollbars.top = 0;

        
        this.scrollbars.horizontal.left = 0;
        this.scrollbars.horizontal.top = this.height - 10;
        this.scrollbars.horizontal.height = 5;
        this.scrollbars.horizontal.width = this.width - 10;
        this.scrollbars.horizontal.fill = '#dedede';

        this.scrollbars.horizontal.cursor = {
            radius: 5,
            fill: '#bababa'
        };

        this.scrollbars.horizontal.cursor.top = this.scrollbars.horizontal.top + this.scrollbars.horizontal.cursor.radius / 2;
        this.scrollbars.horizontal.cursor.left = this.scrollbars.horizontal.cursor.radius;

        this.scrollbars.horizontal.draw = function() {
            if (!this.scrollbars.horizontal.visible) {
                return;
            }
            // remember to reset the matrix
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            // you can give it any shape you like, all canvas drawings operations are possible
            this.ctx.fillStyle = this.scrollbars.horizontal.fill;
            this.ctx.fillRect(this.scrollbars.horizontal.left, this.scrollbars.horizontal.top, this.scrollbars.horizontal.width, this.scrollbars.horizontal.height);
            this.ctx.beginPath();
            this.ctx.arc(this.scrollbars.horizontal.cursor.left, this.scrollbars.horizontal.cursor.top, this.scrollbars.horizontal.cursor.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.scrollbars.horizontal.cursor.fill;
            this.ctx.fill();
        };

        // check if we're hovered
        this.scrollbars.horizontal.isHover = function(x, y) {
            if (x >= this.scrollbars.horizontal.left - this.scrollbars.horizontal.cursor.radius &&
                x <= this.scrollbars.horizontal.left + this.scrollbars.horizontal.width + this.scrollbars.horizontal.cursor.radius &&
                y >= this.scrollbars.horizontal.top - this.scrollbars.horizontal.cursor.radius &&
                y <= this.scrollbars.horizontal.top + this.scrollbars.horizontal.height + this.scrollbars.horizontal.cursor.radius) {
                // we are so record the position of the mouse and set ourself as the one hovered
                this.scrollbars.mousePos = x;
                this.scrollbars.hovered = this.scrollbars.horizontal;
                this.scrollbars.horizontal.visible = true;
                return true;
            }

            // we were visible last call and no wheel event
            else if (this.scrollbars.horizontal.visible &&
                    !this.scrollbars.willHide) {
                this.scrollbars.horizontal.visible = false;
                // redraw
                return true;
            }
        }

        this.scrollbars.hovered = null;
        this.scrollbars.dragged = null;
        this.scrollbars.mousePos = null;

        // check both of our scrollbars
        this.scrollbars.isHover = function(x, y) {
            return this.horizontal.isHover(x, y);
        };

        // draw both of our scrollbars
        this.scrollbars.draw = function() {
            this.horizontal.draw();
        };

        // check if one of our scrollbars is visible
        this.scrollbars.visible = function() {
            return this.horizontal.visible;
        };
        
        // hide it...
        this.scrollbars.hide = function() {
            // only if we're not using the mousewheel or dragging the cursor
            if (this.willHide || this.dragged) {
                return;
            }
            this.horizontal.visible = false;
        };

        // get the area's coord relative to our scrollbar
        var toAreaCoord = function(pos, scrollBar) {
            var sbBase = scrollBar.left;
            var sbMax = scrollBar.width;
            var areaMax = Settings.CANVAS_WIDTH - this.width;

            var ratio = (pos - sbBase) / (sbMax - sbBase);

            return areaMax * ratio;
        };

        // get the scrollbar's coord relative to our total area
        var toScrollCoords = function(pos, scrollBar) {
            var sbBase = scrollBar.left;
            var sbMax = scrollBar.width;
            var areaMax = Settings.CANVAS_WIDTH - this.width;

            var ratio = pos / areaMax;

            return ((sbMax - sbBase) * ratio) + sbBase;
        }

        this.scrollbars.scroll = function() {
            // until where our cursor can go
            var maxCursorPos = this.hovered['width'];
            var pos = 'left';
            // check that we're not out of the bounds
            this.hovered.cursor[pos] = this.mousePos < 0 ? 0 :
                this.mousePos > maxCursorPos ? maxCursorPos : this.mousePos;

            // seems ok so tell  we scrolled
            this[pos] = toAreaCoord(this.hovered.cursor[pos], this.hovered);
            // redraw everything
            // trocar global this por nada
            globalThis.draw();
        }

        // because we will hide it after a small time
        this.scrollbars.willHide;

        // called by the wheel event
        this.scrollbars.scrollBy = function(deltaX) {
            // it's not coming from our scrollbars
            this.hovered = null;

            // we're moving horizontally
            if (deltaX) {
                var newLeft = this.left + deltaX;
                // make sure we're in the bounds
                this.left = newLeft > Settings.CANVAS_WIDTH - this.width ? Settings.CANVAS_WIDTH - this.width : newLeft < 0 ? 0 : newLeft;
                // update the horizontal cursor
                this.horizontal.cursor.left = toScrollCoords(this.left, this.horizontal);
                // show our scrollbar
                this.horizontal.visible = true;
            }

            // if we were called less than the required timeout
            clearTimeout(this.willHide);
            this.willHide = setTimeout(function() {
                this.scrollbars.willHide = null;
                this.scrollbars.hide();
                globalThis.draw();
            }, 500);

            // redraw everything
            globalThis.draw();
        };
        return this;
    }

    draw() {
        // reset everything (clears the canvas + transform + fillStyle + any other property of the context)
        this.width = this.width;

        // move our context by the inverse of our scrollbars' left and top property
        this.ctx.setTransform(1, 0, 0, 1, -this.scrollbars.left, -this.scrollbars.top);

        this.ctx.textAlign = 'center';
        // draw only the visible area
        var visibleLeft = this.scrollbars.left;
        var visibleWidth = visibleLeft + this.width;
        var visibleTop = this.scrollbars.top
        var visibleHeight = visibleTop + this.height;

        // you probably will have to make other calculations than these ones to get your drawings
        // to draw only where required
        for (var w = visibleLeft; w < visibleWidth + 50; w += 100) {
            for (var h = visibleTop; h < visibleHeight + 50; h += 100) {
                var x = Math.round((w) / 100) * 100;
                var y = Math.round((h) / 100) * 100;
                this.ctx.fillText(x + ',' + y, x, y);
            }
        }

        


        // Draw the rectangle
        this.ctx.fillStyle = this.rectColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw the inner text
        const textWidth = this.ctx.measureText(this.innerText).width; // TODO fix this
        this.innerText.draw();

        // draw our scrollbars on top if needed
        this.scrollbars.draw();
        return this;
    }


}

export default Scroll;





// mouse events to track
var mousedown = function(e) {
    // tell the browser we handle this
    e.preventDefault();
    
    // we're over one the scrollbars
    if (app.this.scrollbars.hovered) {
        // new promotion ! it becomes the dragged one
        app.this.scrollbars.dragged = app.this.scrollbars.hovered;
        app.this.scrollbars.scroll();
    }
};

var mousemove = function(e) {
    // check the coordinates of our canvas in the document
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    // we're dragging something
    if (app.this.scrollbars.dragged) {
        // update the mouse position
        app.this.scrollbars.mousePos = x;
        app.this.scrollbars.scroll();
    } else if (app.this.scrollbars.isHover(x, y)) {
        // something has changed, redraw to show or hide the scrollbar
        app.draw();
    }
    e.preventDefault();
};

var mouseup = function() {
    // we dropped it
    app.this.scrollbars.dragged = null;
};

var mouseout = function() {
    // we're out
    if (app.this.scrollbars.visible()) {
        app.this.scrollbars.hide();
        app.this.scrollbars.dragged = false;
        app.draw();
    }
};

var mouseWheel = function(e) {
    e.preventDefault();
    app.this.scrollbars.scrollBy(e.deltaX);
};



canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mouseup', mouseup);
canvas.addEventListener('mouseout', mouseout);
canvas.addEventListener('wheel', mouseWheel);


