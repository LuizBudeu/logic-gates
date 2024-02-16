import Button from "../UIComponents/button.js";
import Sprite from "../UIComponents/sprite.js";
import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Core from "../core.js";

class Reset extends Button {
    constructor(ctx) {
        super(ctx);

        this.debugName = "Reset";
        this.isSelected = false;

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "./assets/images/reset.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
        this.rect.at(Settings.CANVAS_WIDTH - 55, Settings.CANVAS_HEIGHT - 55);

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

        // Confirm clear with user
        const result = confirm("This action will delete all saved gates. Are you sure you want to continue?");

        if (!result) return;

        // Clear local storage
        localStorage.clear();

        Core.reload();
    }
}

export default Reset;
