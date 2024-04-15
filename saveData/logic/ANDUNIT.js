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
function ANDUNIT () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7) {
if (this.AND10 === undefined) {
this.AND10 = new AND();
}
if (this.AND14 === undefined) {
this.AND14 = new AND();
}
if (this.AND15 === undefined) {
this.AND15 = new AND();
}
if (this.AND16 === undefined) {
this.AND16 = new AND();
}
let output = {
output0: this.AND10.compute(input0, input4).output0,
output1: this.AND14.compute(input1, input5).output0,
output2: this.AND15.compute(input2, input6).output0,
output3: this.AND16.compute(input3, input7).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = ANDUNIT;