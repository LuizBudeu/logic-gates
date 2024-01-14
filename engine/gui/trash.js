import Button from "../ui/button.js";
import Sprite from "../ui/sprite.js";
import Settings from "../settings.js";
import Mouse from "../input/mouse.js";

class Trash extends Button {
    constructor(ctx) {
        super(ctx);

        this.debugName = "Trash";

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "./assets/images/trash.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);
        this.rect.at(Settings.CANVAS_WIDTH - 55, Settings.CANVAS_HEIGHT - 55);

        this.image.centerInRect(this.rect);

        this.isSelected = false;
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

            Mouse.setCursorStyle("default");

            Settings.SCENE_MODE = Settings.SCENE_MODE_OPTIONS.DEFAULT;
        } else {
            this.rect.color(Settings.TOOLBOX_BUTTON_SELECTED_COLOR);
            this.isSelected = true;

            Mouse.setCursorStyle("url(./assets/images/trash24px.png), auto");

            Settings.SCENE_MODE = Settings.SCENE_MODE_OPTIONS.DELETE;
        }
    }
}

export default Trash;
