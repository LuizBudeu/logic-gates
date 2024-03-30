const NAND = require("./NAND");
const NOT = require("./NOT");
function AND() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        if (this.NAND3 === undefined) {
            this.NAND3 = new NAND();
        }
        if (this.NOT4 === undefined) {
            this.NOT4 = new NOT();
        }
        let output = {
            output0: this.NOT4.compute(this.NAND3.compute(input0, input1).output0).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = AND;
