import Button from "../ui/button.js";
import Sprite from "../ui/sprite.js";
import Settings from "../settings.js";

class Trash extends Button {
    constructor(ctx) {
        super(ctx);

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "./assets/images/trash.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.MAIN_CONTAINER_COLOR);
        this.rect.at(Settings.CANVAS_WIDTH - 55, Settings.CANVAS_HEIGHT - 55);

        this.image.centerInRect(this.rect);
    }

    start() {}

    update() {}

    draw() {
        this.rect.draw();
        this.image.draw();
    }
}

export default Trash;
