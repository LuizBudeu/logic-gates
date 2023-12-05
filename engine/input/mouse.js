import TwoWayMap from "../utils/twoWayMap.js";

class Mouse {
    // TODO fix removing events
    static canvas = null;
    static position = { x: 0, y: 0 };
    static leftButtonPressed = false;
    static rightButtonPressed = false;
    static dragStart = { x: 0, y: 0 };
    static dragging = false;

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

        Mouse.rightClickDownEvents = [];
        Mouse.rightClickUpEvents = [];
        Mouse.leftClickDownEvents = [];
        Mouse.leftClickUpEvents = [];
        Mouse.mouseMoveEvents = [];
        Mouse.leftClickDraggingEvents = [];
    }

    static handleMouseDown(event) {
        Mouse.updatePosition(event);
        if (event.button === 0) {
            Mouse.leftButtonPressed = true;
            Mouse.handleLeftClickDown(event);

            if (!Mouse.leftClickDragging) {
                Mouse.dragStart = { ...Mouse.position };
                Mouse.leftClickDragging = true;
            }
        } else if (event.button === 2) {
            Mouse.rightButtonPressed = true;
            Mouse.handleRightClickUp(event);
        }
    }

    static handleMouseUp(event) {
        Mouse.updatePosition(event);
        if (event.button === 0) {
            Mouse.leftButtonPressed = false;
            Mouse.handleLeftClickUp(event);
            Mouse.leftClickDragging = false;
        } else if (event.button === 2) {
            Mouse.rightButtonPressed = false;
            Mouse.handleRightClickUp(event);
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

    static addRightClickDownEvent(callback, targetGameObject = null) {
        Mouse.rightClickDownEvents.push({ callback, targetGameObject });
    }

    static removeRightClickEvent(callback) {
        Mouse.rightClickDownEvents = Mouse.rightClickDownEvents.filter((cb) => cb !== callback);
    }

    static addRightClickUpEvent(callback, targetGameObject = null) {
        Mouse.rightClickUpEvents.push({ callback, targetGameObject });
    }

    static removeRightClickUpEvent(callback) {
        Mouse.rightClickUpEvents = Mouse.rightClickUpEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickUpEvent(callback, targetGameObject = null) {
        Mouse.leftClickUpEvents.push({ callback, targetGameObject });
    }

    static removeLeftClickUpEvent(callback) {
        Mouse.LeftClickUpEvents = Mouse.LeftClickUpEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickDownEvent(callback, targetGameObject = null) {
        Mouse.leftClickDownEvents.push({ callback, targetGameObject });
    }

    static removeLeftClickEvent(callback) {
        Mouse.leftClickDownEvents = Mouse.leftClickDownEvents.filter((cb) => cb !== callback);
    }

    static addMouseMoveEvent(callback) {
        Mouse.mouseMoveEvents.push(callback);
    }

    static removeMouseMoveEvent(callback) {
        Mouse.mouseMoveEvents = Mouse.mouseMoveEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickDraggingEvent(callback, targetGameObject = null) {
        Mouse.leftClickDraggingEvents.push({ callback, targetGameObject });
    }

    static removeDraggingEvent(callback) {
        Mouse.leftClickDraggingEvents = Mouse.leftClickDraggingEvents.filter((cb) => cb !== callback);
    }

    static handleRightClickDown(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.rightClickDownEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isMouseOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "right",
            });
        });
    }

    static handleRightClickUp(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.rightClickUpEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isMouseOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "right",
            });
        });
    }

    static handleLeftClickDown(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.leftClickDownEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isMouseOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "left",
            });
        });
    }

    static handleLeftClickUp(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.leftClickUpEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isMouseOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "left",
            });
        });
    }

    static handleMouseMove(event) {
        Mouse.updatePosition(event);
        const { x, y } = Mouse.getPosition();

        if (Mouse.leftButtonPressed) Mouse.handleLeftClickDragging(event);

        Mouse.mouseMoveEvents.forEach((callback) => {
            callback({
                x,
                y,
            });
        });
    }

    static handleLeftClickDragging(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.leftClickDraggingEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isMouseOver(targetGameObject)) return;

            const deltaX = x - Mouse.dragStart.x;
            const deltaY = y - Mouse.dragStart.y;

            callback({
                x,
                y,
                dragStartX: Mouse.dragStart.x,
                dragStartY: Mouse.dragStart.y,
                deltaX,
                deltaY,
            });

            Mouse.dragStart = { ...Mouse.position };
        });
    }

    static isLeftButtonDown() {
        return Mouse.leftButtonPressed;
    }

    static isRightButtonDown() {
        return Mouse.rightButtonPressed;
    }

    static isMouseOver(gameObject) {
        const { x, y } = Mouse.position;
        return x >= gameObject.x && x <= gameObject.x + gameObject.width && y >= gameObject.y && y <= gameObject.y + gameObject.height;
    }
}

export default Mouse;
