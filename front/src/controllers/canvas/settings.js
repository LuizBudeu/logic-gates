const Settings = {
    CANVAS_WIDTH: 800, // This is the default value, it will be changed in core.js
    CANVAS_HEIGHT: 600, // This is the default value, it will be changed in core.js
    DELTA_TIME: 0.167, // This is the default value, it will be changed in core.js
    BACKGROUND_LAYER: 0,
    FOREGROUND_LAYER: 5,
    UI_LAYER: 8,
    CANVAS_BACKGROUND_COLOR: "#282828",
    MAIN_CONTAINER_COLOR: "#3D3D3D",
    TOOLBOX_COLOR: "#0C0C0C",
    TOOLBOX_HEIGHT: 60,
    SAVED_GATE_COLOR: "#262626",
    SELECTION_COLOR: "#00F",
    IO_CIRCLE_RADIUS: 20,
    COMPONENT_IO_OFF_COLOR: "#1C2027",
    COMPONENT_IO_ON_COLOR: "#348c20",
    COMPONENT_IO_CIRCLE_RADIUS: 10,
    IO_LABEL_FONT_SIZE: 12,
    IO_LABEL_RECT_COLOR: "#282828",
    WIRE_COLOR: "#00F",
    WIRE_WIDTH: 3,
    WIRE_DOT_RADIUS: 3,
    MAIN_CONTAINER_MARGIN: 30,
    TOOLBOX_BUTTON_COLOR: "#575656",
    TOOLBOX_BUTTON_SELECTED_COLOR: "#858383",
    SCENE_MODE: 0,
    SCENE_MODE_OPTIONS: {
        DEFAULT: 0,
        DELETE: 1,
    },
    GATE_COLOR: "#7a130d",
    IS_SHOWING_IO_LABELS: false,
    GATE_BASE_HEIGHT: 40,
    GATE_BASE_WIDTH: 80,
    GATE_BASE_HEIGHT_MULTIPLIER: 40,
    GATE_NAME_FONT_SIZE: 20,
    SAVED_GATE_NAME_FONT_SIZE: 15,
    SAVED_GATE_BASE_HEIGHT: 35,
    SAVED_GATE_BASE_WIDTH: 60,
    SAVED_GATE_BASE_MARGIN: {
        x: 10,
        y: 12,
    },
};

export default Settings;
