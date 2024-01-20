import Bridge from "../bridge.js";
import Wire from "../components/wire.js";
import WiringManager from "./wiringManager.js";
import CircuitManager from "./circuitManager.js";
import Input from "../components/input.js";

class SelectionManager {
    static selectedIOs = [];

    static selectIO(io) {
        // Can only have two selected IOs at a time
        if (this.selectedIOs.length >= 2) {
            // Deselect the most recent one
            this.selectedIOs[1].isSelected = false;
            Bridge.sceneInstance.remove(this.selectedIOs[1].selectionCircle, 0);
            this.selectedIOs.pop();
        }

        if (this.selectedIOs.length === 1 && this.selectedIOs[0] === io) {
            return;
        }

        this.selectedIOs.push(io);
        io.isSelected = true;
        io.selectionCircle.at(io.circle.x, io.circle.y).radius(io.circle.radius() + 5);
        Bridge.sceneInstance.place(io.selectionCircle, 0);

        if (this.selectedIOs.length === 2) {
            this.connectIOs();
        }
    }

    static deselectIO(io) {
        io.isSelected = false;
        SelectionManager.selectedIOs = SelectionManager.selectedIOs.filter((selectedIO) => selectedIO !== io);
        Bridge.sceneInstance.remove(io.selectionCircle, 0);
    }

    static deselectAll() {
        this.selectedIOs.forEach((io) => {
            io.isSelected = false;
            Bridge.sceneInstance.remove(io.selectionCircle, 0);
        });
        this.selectedIOs = [];
    }

    static connectIOs() {
        const io1 = this.selectedIOs[0];
        const io2 = this.selectedIOs[1];

        if (io1.isGlobal() && io2.isGlobal() && ((io1 instanceof Input && io2 instanceof Input) || (io1.debugName.includes("Output") && io2.debugName.includes("Output")))) {
            alert("Cannot connect two global inputs or outputs");
            this.deselectAll();
            return;
        }

        const connection = CircuitManager.addConnection(io1, io2);

        WiringManager.addWiring(connection);

        this.deselectAll();
    }
}

export default SelectionManager;
