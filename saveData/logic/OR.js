const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
function OR() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        if (this.NAND3 === undefined) {
            this.NAND3 = new NAND();
        }
        if (this.NOT4 === undefined) {
            this.NOT4 = new NOT();
        }
        if (this.NOT5 === undefined) {
            this.NOT5 = new NOT();
        }
        let output = {
            output0: this.NAND3.compute(this.NOT4.compute(input0).output0, this.NOT5.compute(input1).output0).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = OR;
