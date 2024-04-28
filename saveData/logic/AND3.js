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
function AND3 () {
this.lastOutput = {};
this.compute = function (input0, input1, input2) {
if (this.AND5 === undefined) {
this.AND5 = new AND();
}
if (this.AND6 === undefined) {
this.AND6 = new AND();
}
let output = {
output0: this.AND6.compute(this.AND5.compute(input0, input1).output0, input2).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = AND3;