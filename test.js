class CircuitNode {
    constructor(component, inputs = []) {
        this.component = component; // Reference to a gate or global IO
        this.inputs = inputs; // Array of CircuitNodes representing the inputs
    }
}

class CircuitManager {
    constructor() {
        this.globalInputs = [];
        this.globalOutputs = [];
        this.circuitTree = null;
    }

    buildCircuitTree() {
        // Create global inputs
        const globalInput1 = new CircuitNode("Global Input 1");
        const globalInput2 = new CircuitNode("Global Input 2");

        // Create OR gate
        const orGate = new CircuitNode("OR Gate");

        // Connect global inputs to the OR gate
        orGate.inputs.push(globalInput1, globalInput2);

        // Create global output
        const globalOutput = new CircuitNode("Global Output");

        // Connect OR gate to global output
        globalOutput.inputs.push(orGate);

        // Set the circuit tree root
        this.circuitTree = globalOutput;
    }

    saveCircuitToFile() {
        // Traverse the circuit tree and generate JavaScript code
        // For simplicity, let's just print the structure for now
        this.traverseAndPrint(this.circuitTree);
    }

    traverseAndPrint(node) {
        console.log(node.component);

        if (node.inputs.length > 0) {
            for (const inputNode of node.inputs) {
                this.traverseAndPrint(inputNode);
            }
        }
    }
}

// Example usage
const circuitManager = new CircuitManager();
circuitManager.buildCircuitTree();
circuitManager.saveCircuitToFile();
