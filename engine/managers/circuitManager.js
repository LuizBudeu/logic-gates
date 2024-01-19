import Settings from "../settings.js";
import Bridge from "../bridge.js";
import IO from "../components/io.js";
import Connection from "../components/connection.js";
import Input from "../components/input.js";

class CircuitManager {
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
    }

    static getNewConnection(io1, io2) {
        const { upstream, downstream } = CircuitManager.getIOsDirection(io1, io2);
        return new Connection(upstream, downstream);
    }

    static getConnection(io1, io2) {}

    static getIOsDirection(io1, io2) {
        let upstream;
        let downstream;

        if (io1 instanceof Input) {
            if (io1.gate === null) {
                upstream = io1;
                downstream = io2;
            } else {
                downstream = io1;
                upstream = io2;
            }
        } else {
            if (io1.gate === null) {
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
}

export default CircuitManager;
