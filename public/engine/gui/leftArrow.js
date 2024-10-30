import Button from "../UIComponents/button.js";
import Sprite from "../UIComponents/sprite.js";
import Settings from "../settings.js";

export default class LeftArrow extends Button {
    constructor(ctx, shiftingBar) {
        super(ctx);
        this.shiftingBar = shiftingBar;

        this.debugName = "LeftArrow";
        this.isSelected = false;

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "./assets/images/left_arrow.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
        this.rect.at(10, Settings.CANVAS_HEIGHT - 55);

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

        this.shiftingBar.shiftLeft();
    }
}
