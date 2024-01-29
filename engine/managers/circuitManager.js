import Settings from "../settings.js";
import Bridge from "../bridge.js";
import WiringManager from "./wiringManager.js";
import Input from "../eletricalComponents/input.js";
// import Output from "../eletricalComponents/output.js";
import IO from "../eletricalComponents/io.js";
// import Gate from "../eletricalComponents/gate.js";

import Connection from "../eletricalComponents/connection.js";

class CircuitManager {
    static circuit = {
        components: [],
        // connections: [],
    };

    static solveCircuit() {
        CircuitManager.circuit.components.forEach((component) => {
            // If component is an upstream IO, propagate
            if (component instanceof IO) {
                component.IOConnections.forEach((connection) => {
                    if (component.isUpstream(connection)) {
                        component.propagate(connection.downstream);
                    }
                });
            }
            // Component is a gate, compute
            else {
                component.compute();
            }
        });
    }

    static clearCircuit() {
        const gates = CircuitManager.getGates();
        gates.forEach((gate) => {
            gate.delete();
        });
    }

    static addComponent(component) {
        CircuitManager.circuit.components.push(component);
    }

    static removeComponent(component) {
        CircuitManager.circuit.components = CircuitManager.circuit.components.filter((comp) => comp !== component);
    }

    static addConnection(io1, io2) {
        const connection = this.getNewConnection(io1, io2);
        io1.IOConnections.push(connection);
        io2.IOConnections.push(connection);
        return connection;
    }

    static removeConnection(connection) {
        const io1 = connection.upstream;
        const io2 = connection.downstream;

        io1.IOConnections = io1.IOConnections.filter((conn) => conn !== connection);
        io2.IOConnections = io2.IOConnections.filter((conn) => conn !== connection);

        WiringManager.removeWiring(connection);

        // Reset the value of the IOs to natural state
        if (io1 instanceof Input && !io1.isGlobal()) {
            io1.value(false);
        }
        if (io2 instanceof Input && !io2.isGlobal()) {
            io2.value(false);
        }
        if (io1.debugName.includes("_Output") && io1.isGlobal()) {
            io1.value(false);
        }
        if (io2.debugName.includes("_Output") && io2.isGlobal()) {
            io2.value(false);
        }
        if (io1.debugName.includes("_Output") && !io1.isGlobal()) {
            io2.value(false);
        }
        if (io2.debugName.includes("_Output") && !io2.isGlobal()) {
            io1.value(false);
        }
    }

    static getNewConnection(io1, io2) {
        const { upstream, downstream } = CircuitManager.getIOsDirection(io1, io2);
        return new Connection(upstream, downstream);
    }

    static getConnection(io1, io2) {}

    static getIOsDirection(io1, io2) {
        let upstream, downstream;

        if (io1 instanceof Input) {
            if (io1.isGlobal()) {
                upstream = io1;
                downstream = io2;
            } else {
                downstream = io1;
                upstream = io2;
            }
        } else {
            if (io1.isGlobal()) {
                downstream = io1;
                upstream = io2;
            } else {
                upstream = io1;
                downstream = io2;
            }
        }

        return {
            upstream,
            downstream,
        };
    }

    static getGates() {
        return CircuitManager.circuit.components.filter((component) => component.debugName.includes("_Gate") && !(component instanceof IO));
    }
}

export default CircuitManager;
