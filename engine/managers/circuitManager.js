import Settings from "../settings";
import Bridge from "../bridge";
import IO from "../components/io";
import Connection from "../components/connection";

// Example of a circuit:
// CircuitManager.circuit = {
//     components: {
//         1 (circuitId): Component1 (obj),
//         2 (circuitId): Component2 (obj),
//         ...
//     },
//     connections: {
//         1 (keyof components): {
//             io1 (upstream IO obj): [
//                  io1.connections.downstream (IO obj),
//            ],
//            io2 (upstream IO obj): [
//                 io2.connections.downstream (IO obj),
//                 io2.connections.downstream (IO obj)
//             ],
//         ...
//         },
//     }

class CircuitManager {
    static circuitId = 0;
    static circuit = {
        components: {},
        connections: {},
    };

    // Components can be:
    // - Gates
    // - Global Inputs
    // - Global Outputs
    static addComponentToCircuit(component) {
        // Update circuitId
        component.circuitId = CircuitManager.circuitId;
        CircuitManager.circuitId++;

        // Save component to circuit
        CircuitManager.circuit.components[component.id] = component;

        // Save connections to circuit

        let connections = [];
        if (component instanceof Gate) {
            component.inputs.forEach((input) => {
                connections.push(input.IOconnections);
            });
            connections.push(component.output.IOconnections); // TODO add possibility of multiple outputs
        } else {
            connections = component.IOconnections;
        }

        connections.forEach((connection) => {
            if (!CircuitManager.circuit.connections[component.id]) {
                CircuitManager.circuit.connections[component.id] = {};
            }

            if (!CircuitManager.circuit.connections[component.id][connection.upstream]) {
                CircuitManager.circuit.connections[component.id][connection.upstream] = [];
            }

            CircuitManager.circuit.connections[component.id][connection.upstream].push(connection.downstream);
        });
    }

    static removeComponentFromCircuit(component) {
        component.circuitId = null;

        CircuitManager.circuit.components = CircuitManager.circuit.components.filter((c) => c !== component);
        CircuitManager.circuit.connections = CircuitManager.circuit.connections.filter((c) => c !== component);
    }

    static makeConnection(io1, io2) {
        const connection = new Connection(io1, io2);
        io1.IOconnections.push(connection);
        io2.IOconnections.push(connection);
    }

    static getIOsDirection(io1, io2) {
        let io1Direction = {
            upstream: null,
            downstream: null,
        };

        if (io1.debugName.includes("Global_Input")) {
            io1Direction.upstream = io1;
            io1Direction.downstream = io2;
        } else if (io1.debugName.includes("Global_Input")) {
            io1Direction.upstream = io2;
            io1Direction.downstream = io1;
        } else {
            connections = CircuitManager.circuit.connections[io1.circuitId];
        }
    }

    static solveCircuit() {
        // TODO
    }
}

export default CircuitManager;

// {
//     components: {
//         1 (circuitId): Component1 (obj),
//         2 (circuitId): Component2 (obj),

//     },
//     connections: {
//         1 (keyof components): {
//             io1 (upstream IO obj): [
//                  io1.connections.downstream (IO obj),
//            ],
//            io2 (upstream IO obj): [
//                 io2.connections.downstream (IO obj),
//                 io2.connections.downstream (IO obj)
//             ],

//         },
//     }
// }

// {
//     1: GlobalInput1,
//     2: GlobalInput2,
//     3: GlobalOutput1,
//     4: NAND,
//     5: OR
// }

// {
//     1: {
//         GlobalInput1 = [NANDInput1, NANDInput2]
//     },
//     2: {
//         GlobalInput2 = [OInput2]
//     },
//     3: {
//         ORInput1 = [GlobalOutput1]
//     },
//     4: {
//         GlobalInput1: [NANDInput1, NANDInput2]
//     },
//     5: {
//         NANDOutput1: [ORInput1],
//         GlobalInput2: [ORInput2]
//     }
// }
