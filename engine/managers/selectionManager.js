import Bridge from "../bridge.js";
import Wire from "../components/wire.js";
import WiringManager from "./wiringManager.js";
import CircuitManager from "./circuitManager.js";

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
        // this.selectedIOs[0].connect(this.selectedIOs[1]);
        const connection = CircuitManager.addConnection(...this.selectedIOs);

        WiringManager.addWiring(connection);

        this.deselectAll();
    }
}

export default SelectionManager;
