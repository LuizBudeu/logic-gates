const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
const SRLATCH = require("./SRLATCH");
const FOURBITADDER = require("./FOURBITADDER");
const AND4 = require("./AND4");
const AND8 = require("./AND8");
const ANDUNIT = require("./ANDUNIT");
const ORUNIT = require("./ORUNIT");
const AND3 = require("./AND3");
const OR4 = require("./OR4");
const MUX4_1 = require("./MUX4_1");
const ARITUNIT = require("./ARITUNIT");
function NOT4 () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3) {
if (this.NOT9 === undefined) {
this.NOT9 = new NOT();
}
if (this.NOT10 === undefined) {
this.NOT10 = new NOT();
}
if (this.NOT11 === undefined) {
this.NOT11 = new NOT();
}
if (this.NOT12 === undefined) {
this.NOT12 = new NOT();
}
let output = {
output0: this.NOT9.compute(input0).output0,
output1: this.NOT10.compute(input1).output0,
output2: this.NOT11.compute(input2).output0,
output3: this.NOT12.compute(input3).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = NOT4;