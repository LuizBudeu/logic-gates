const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
function XOR() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        if (this.NAND3 === undefined) {
            this.NAND3 = new NAND();
        }
        if (this.OR4 === undefined) {
            this.OR4 = new OR();
        }
        if (this.AND5 === undefined) {
            this.AND5 = new AND();
        }
        let output = {
            output0: this.AND5.compute(this.OR4.compute(input0, input1).output0, this.NAND3.compute(input1, input0).output0).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = XOR;
