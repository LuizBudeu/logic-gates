import Button from "../ui/button.js";
import Sprite from "../ui/sprite.js";
import Settings from "../settings.js";
import SaveManager from "../managers/saveManager.js";

class Save extends Button {
    constructor(ctx) {
        super(ctx);

        this.debugName = "Save";

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "./assets/images/save.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.MAIN_CONTAINER_COLOR);
        this.rect.at(Settings.CANVAS_WIDTH - 110, Settings.CANVAS_HEIGHT - 55);

        this.image.centerInRect(this.rect);
    }

    start() {}

    update() {}

    draw() {
        this.rect.draw();
        this.image.draw();
    }

    onLeftClick() {
        if (this.isSelected) {
            this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
            this.isSelected = false;
        } else {
            this.rect.color(Settings.TOOLBOX_BUTTON_SELECTED_COLOR);
            this.isSelected = true;

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

            // Save circuit to gate
            SaveManager.saveCircuitToGate(gateName);
        }
    }
}

export default Save;
