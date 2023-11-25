class Mouse {
    static canvas = null;
    static position = { x: 0, y: 0 };
    static leftButtonPressed = false;
    static rightButtonPressed = false;

    static initialize(canvas) {
        if (Mouse.canvas) {
            console.error("Mouse is already initialized.");
            return;
        }

        Mouse.canvas = canvas;

        // Event listeners for mouse movement and clicks
        Mouse.canvas.addEventListener("mousemove", Mouse.handleMouseMove);
        Mouse.canvas.addEventListener("mousedown", Mouse.handleMouseDown);
        Mouse.canvas.addEventListener("mouseup", Mouse.handleMouseUp);

        Mouse.rightClickEvents = [];
        Mouse.leftClickEvents = [];
    }

    static handleMouseMove(event) {
        Mouse.updatePosition(event);
    }

    static handleMouseDown(event) {
        Mouse.updatePosition(event);
        if (event.button === 0) {
            Mouse.leftButtonPressed = true;
            Mouse.handleLeftClick(event);
        } else if (event.button === 2) {
            Mouse.rightButtonPressed = true;
            Mouse.handleRightClick(event);
        }
    }

    static handleMouseUp(event) {
        Mouse.updatePosition(event);
        if (event.button === 0) {
            Mouse.leftButtonPressed = false;
        } else if (event.button === 2) {
            Mouse.rightButtonPressed = false;
        }
    }

    static updatePosition(event) {
        const rect = Mouse.canvas.getBoundingClientRect();
        Mouse.position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    static getPosition() {
        return { ...Mouse.position };
    }

    static addRightClickEvent(callback) {
        Mouse.rightClickEvents.push(callback);
    }

    static removeRightClickEvent(callback) {
        Mouse.rightClickEvents = Mouse.rightClickEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickEvent(callback) {
        Mouse.leftClickEvents.push(callback);
    }

    static removeLeftClickEvent(callback) {
        Mouse.LeftClickEvents = Mouse.LeftClickEvents.filter((cb) => cb !== callback);
    }

    static handleRightClick(event) {
        event.preventDefault(); // Prevent the default context menu
        Mouse.rightClickEvents.forEach((callback) => {
            callback({
                x: event.clientX - Mouse.canvas.getBoundingClientRect().left,
                y: event.clientY - Mouse.canvas.getBoundingClientRect().top,
                button: "right",
            });
        });
    }

    static handleLeftClick(event) {
        Mouse.leftClickEvents.forEach((callback) => {
            callback({
                x: event.clientX - Mouse.canvas.getBoundingClientRect().left,
                y: event.clientY - Mouse.canvas.getBoundingClientRect().top,
                button: "left",
            });
        });
    }

    static isLeftButtonDown() {
        return Mouse.leftButtonPressed;
    }

    static isRightButtonDown() {
        return Mouse.rightButtonPressed;
    }
}

export default Mouse;
