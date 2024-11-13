const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const XOR = require("./XOR");
function ADDER () {
this.lastOutput = {};
this.compute = function (input0, input1, input2) {
if (this.XOR3 === undefined) {
this.XOR3 = new XOR();
}
if (this.XOR4 === undefined) {
this.XOR4 = new XOR();
}
if (this.AND7 === undefined) {
this.AND7 = new AND();
}
if (this.AND8 === undefined) {
this.AND8 = new AND();
}
if (this.OR9 === undefined) {
this.OR9 = new OR();
}
let output = {
output0: this.XOR3.compute(this.XOR4.compute(input0, input1).output0, input2).output0,
output1: this.OR9.compute(this.AND7.compute(this.XOR4.compute(input0, input1).output0, input2).output0, this.AND8.compute(input0, input1).output0).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = ADDER;