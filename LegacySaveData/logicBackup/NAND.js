function NAND() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        let output = {
            output0: !(input0 && input1),
        };
        this.lastOutput = output;
        return output;
    };
}

module.exports = NAND;
