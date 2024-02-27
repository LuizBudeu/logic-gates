import Button from "../UIComponents/button.js";
import Sprite from "../UIComponents/sprite.js";
import Settings from "../settings.js";
import SaveManager from "../managers/saveManager.js";
import CircuitManager from "../managers/circuitManager.js";
import Bridge from "../bridge.js";

class Save extends Button {
    constructor(ctx) {
        super(ctx);

        this.debugName = "Save";
        this.isSelected = false;

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "./assets/images/save.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
        this.rect.at(Settings.CANVAS_WIDTH - 110, Settings.CANVAS_HEIGHT - 55);

        this.image.centerInRect(this.rect);
    }

    start() {}

    update() {}

    draw() {
        this.rect.draw();
        this.image.draw();
    }

    onLeftClickDown({ x, y, button }) {
        if (!this.isSelected) {
            this.rect.color(Settings.TOOLBOX_BUTTON_SELECTED_COLOR);
            this.isSelected = true;
        }
    }

    onLeftClickUp() {
        if (this.isSelected) {
            this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
            this.isSelected = false;
        }

        const gates = CircuitManager.getGates();
        if (gates.length === 0) {
            alert("There are no saved gates");
            return;
        }

        // Prompt user for gate name
        const gateName = prompt("Enter gate name:");

        // Check if user cancelled
        if (gateName === null) {
            this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
            this.isSelected = false;
            return;
        }

        // Check if gate name is empty
        if (gateName === "") {
            this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
            this.isSelected = false;
            throw new Error("Saved gate name cannot be empty");
        }

        // Check if gate name already exists
        const savedGates = SaveManager.getSavedGates();
        const gateNameExists = savedGates.some((savedGate) => savedGate.name === gateName.toUpperCase());
        if (gateNameExists) {
            this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
            this.isSelected = false;
            alert(`Gate name "${gateName}" already exists`);
            return;
        }

        // Save circuit to gate
        SaveManager.saveCircuitToGate(gateName.toUpperCase());
    }
}

export default Save;
