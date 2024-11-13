export const Keys = {
    ArrowLeft: "ArrowLeft",
    ArrowUp: "ArrowUp",
    ArrowRight: "ArrowRight",
    ArrowDown: "ArrowDown",
    Space: " ",
    Enter: "Enter",
    Shift: "Shift",
    Control: "Control",
    Alt: "Alt",
    W: "w",
    A: "a",
    S: "s",
    D: "d",
    H: "h",
};

export default class Keyboard {
    static keyStates = {};
    static keyDownEvents = {};
    static keyUpEvents = {};

    static initialize() {
        window.addEventListener("keydown", Keyboard.handleKeyDown);
        window.addEventListener("keyup", Keyboard.handleKeyUp);
    }

    static addKeyDownEvent(callback, ...keys) {
        keys.forEach((key) => {
            Keyboard.keyDownEvents[key] = callback;
        });
    }

    static removeKeyDownEvent(...keys) {
        keys.forEach((key) => {
            delete Keyboard.keyDownEvents[key];
        });
    }

    static handleKeyDown(event) {
        const key = event.key;
        Keyboard.keyStates[key] = true;

        const callback = Keyboard.keyDownEvents[key];
        if (callback) {
            callback();
        }
    }

    static addKeyUpEvent(callback, ...keys) {
        keys.forEach((key) => {
            Keyboard.keyUpEvents[key] = callback;
        });
    }

    static removeKeyUpEvent(...keys) {
        keys.forEach((key) => {
            delete Keyboard.keyUpEvents[key];
        });
    }

    static handleKeyUp(event) {
        const key = event.key;
        Keyboard.keyStates[key] = false;

        const callback = Keyboard.keyUpEvents[key];
        if (callback) {
            callback();
        }
    }

    static isKeyDown(key) {
        return Keyboard.keyStates[key] || false;
    }
}
