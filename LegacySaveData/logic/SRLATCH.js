const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
function SRLATCH () {
this.lastOutput = {};
this.compute = function (input0, input1) {
if (this.NOR3 === undefined) {
this.NOR3 = new NOR();
}
if (this.NOR4 === undefined) {
this.NOR4 = new NOR();
}
let output = {
output0: this.NOR4.compute(this.NOR3.compute(input0, this.NOR4.lastOutput?.output0).output0, input1).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = SRLATCH;