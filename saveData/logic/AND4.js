const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
const SRLATCH = require("./SRLATCH");
const FOURBITADDER = require("./FOURBITADDER");
function AND4 () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3) {
if (this.AND4 === undefined) {
this.AND4 = new AND();
}
if (this.AND5 === undefined) {
this.AND5 = new AND();
}
if (this.AND7 === undefined) {
this.AND7 = new AND();
}
let output = {
output0: this.AND7.compute(this.AND5.compute(this.AND4.compute(input0, input1).output0, input2).output0, input3).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = AND4;