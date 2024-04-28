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
function OR4 () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3) {
if (this.OR11 === undefined) {
this.OR11 = new OR();
}
if (this.OR12 === undefined) {
this.OR12 = new OR();
}
if (this.OR13 === undefined) {
this.OR13 = new OR();
}
let output = {
output0: this.OR13.compute(this.OR12.compute(this.OR11.compute(input0, input1).output0, input2).output0, input3).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = OR4;