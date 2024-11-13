const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const XOR = require("./XOR");
function ADDER() {
    this.lastOutput = {};
    this.compute = function (input0, input1, input2) {
        if (this.XOR3 === undefined) {
            this.XOR3 = new XOR();
        }
        if (this.XOR4 === undefined) {
            this.XOR4 = new XOR();
        }
        if (this.AND5 === undefined) {
            this.AND5 = new AND();
        }
        if (this.AND6 === undefined) {
            this.AND6 = new AND();
        }
        if (this.OR7 === undefined) {
            this.OR7 = new OR();
        }
        let output = {
            output0: this.XOR4.compute(this.XOR3.compute(input0, input1).output0, input2).output0,
            output1: this.OR7.compute(this.AND6.compute(this.XOR3.compute(input0, input1).output0, input2).output0, this.AND5.compute(input1, input0).output0).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = ADDER;
