import Button from "../UIComponents/button.js";
import Sprite from "../UIComponents/sprite.js";
import Settings from "../settings.js";
import Bridge from "../bridge.js";
import Core from "../core.js";
// import {Alert} from 'react-native';

class Reset extends Button {
    constructor(ctx) {
        super(ctx);

        this.debugName = "Reset";
        this.isSelected = false;

        const imageSize = 40;
        this.image = new Sprite(this.ctx, "/images/reset.png");
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
        // let result = false
        const result = window.confirm("This action will delete all saved gates. Are you sure you want to continue?");
        // Alert.alert('Delete all saved gates', 'This action will delete all saved gates. Are you sure you want to continue?', [
        //     {
        //       text: 'Cancel',
        //       onPress: () => console.log('Cancel Pressed'),
        //       style: 'cancel',
        //     },
        //     {text: 'OK', onPress: () => {
        //         console.log('OK Pressed');
        //         result = true;
        //     }},
        //   ]);
      

        if (!result) return;

        // Clear local storage
        localStorage.clear();

        Core.reload();
    }
}

export default Reset;
