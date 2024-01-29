import Button from "../UIComponents/button.js";
import Sprite from "../UIComponents/sprite.js";
import Settings from "../settings.js";
import Bridge from "../bridge.js";
import SelectionManager from "../managers/selectionManager.js";

class MinusIO extends Button {
    constructor(ctx, IOtype) {
        super(ctx);
        this.ctx = ctx;
        this.IOtype = IOtype;

        this.debugName = IOtype + "_Minus";

        const imageSize = 20;
        this.image = new Sprite(this.ctx, "./assets/images/minus.png");
        this.image.size(imageSize, imageSize);

        this.rect.size(imageSize + 10, imageSize + 10);
        this.rect.color(Settings.TOOLBOX_BUTTON_COLOR);

        const mainContainerHeight = Settings.CANVAS_HEIGHT - (Settings.MAIN_CONTAINER_MARGIN + 90);

        if (IOtype === "input") {
            this.rect.center(Settings.MAIN_CONTAINER_MARGIN, mainContainerHeight + Settings.MAIN_CONTAINER_MARGIN);
        } else {
            this.rect.center(Settings.CANVAS_WIDTH - Settings.MAIN_CONTAINER_MARGIN, mainContainerHeight + Settings.MAIN_CONTAINER_MARGIN);
        }

        this.image.centerInRect(this.rect);

        this.isSelected = false;
    }

    start() {}

    update() {}

    draw() {
        this.rect.draw();
        this.image.draw();
    }

    onLeftClickDown() {
        Bridge.sceneInstance.removeGlobalIO(this.IOtype);
        SelectionManager.deselectAll();
    }
}

export default MinusIO;
