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
function ORUNIT () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7) {
if (this.OR12 === undefined) {
this.OR12 = new OR();
}
if (this.OR13 === undefined) {
this.OR13 = new OR();
}
if (this.OR14 === undefined) {
this.OR14 = new OR();
}
if (this.OR15 === undefined) {
this.OR15 = new OR();
}
let output = {
output0: this.OR12.compute(input0, input4).output0,
output1: this.OR13.compute(input1, input5).output0,
output2: this.OR14.compute(input2, input6).output0,
output3: this.OR15.compute(input3, input7).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = ORUNIT;