import Settings from "../settings.js";
import Bridge from "../bridge.js";
import WiringManager from "./wiringManager.js";
import Input from "../eletricalComponents/input.js";
import IO from "../eletricalComponents/io.js";

import Connection from "../eletricalComponents/connection.js";

class CircuitManager {
    static circuit = {
        components: [],
        connections: [],
    };

    static circuitId = 0;

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

        if (component instanceof IO && !component.isGlobal()) {
            return;
        }

        component.circuitId = CircuitManager.circuitId++;
    }

    static removeComponent(component) {
        CircuitManager.circuit.components = CircuitManager.circuit.components.filter((comp) => comp !== component);
    }

    static addConnection(io1, io2) {
        const connection = this.getNewConnection(io1, io2);
        io1.IOConnections.push(connection);
        io2.IOConnections.push(connection);
        CircuitManager.circuit.connections.push(connection);
        return connection;
    }

    static removeConnection(connection) {
        const io1 = connection.upstream;
        const io2 = connection.downstream;

        io1.IOConnections = io1.IOConnections.filter((conn) => conn !== connection);
        io2.IOConnections = io2.IOConnections.filter((conn) => conn !== connection);

        WiringManager.removeWiring(connection);

        // Reset the value of the IOs to natural state
        if (io1.type === "input" && !io1.isGlobal()) {
            io1.value(false);
        }
        if (io2.type === "input" && !io2.isGlobal()) {
            io2.value(false);
        }
        if (io1.type === "output" && io1.isGlobal()) {
            io1.value(false);
        }
        if (io2.type === "output" && io2.isGlobal()) {
            io2.value(false);
        }
        if (io1.type === "output" && !io1.isGlobal()) {
            io2.value(false);
        }
        if (io2.type === "output" && !io2.isGlobal()) {
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

        if (io1.type === "input") {
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

    static serialize() {
        const serializedCircuit = {
            components: [],
            connections: [],
        };

        CircuitManager.circuit.components.forEach((component) => {
            // Don't serialize non-global IOs because the gates will serialize them
            if (component instanceof IO && !component.isGlobal()) {
                return;
            }

            serializedCircuit.components.push(component.serialize());
        });

        CircuitManager.circuit.connections.forEach((connection) => {
            serializedCircuit.connections.push(connection.serialize());
        });

        return JSON.stringify(serializedCircuit);
    }

    static serialize2() {
        const serializedCircuit = {
            components: [],
            connections: [],
        };

        CircuitManager.circuit.components.forEach((component) => {
            // Don't serialize non-global IOs because the gates will serialize them
            if (component instanceof IO && !component.isGlobal()) {
                return;
            }

            serializedCircuit.components.push(component.serialize());
        });

        CircuitManager.circuit.connections.forEach((connection) => {
            serializedCircuit.connections.push(connection.serialize());
        });

        return JSON.stringify(serializedCircuit);
    }
}

export default CircuitManager;
