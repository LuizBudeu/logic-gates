const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const DLATCH = require("./DLATCH");
const REGISTER = require("./REGISTER");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
const FOURBITADDER = require("./FOURBITADDER");
const ALU = require("./ALU");
function DFLIPFLOP () {
this.lastOutput = {};
this.compute = function (input0, input1) {
if (this.DLATCH3 === undefined) {
this.DLATCH3 = new DLATCH();
}
if (this.DLATCH4 === undefined) {
this.DLATCH4 = new DLATCH();
}
if (this.NOT5 === undefined) {
this.NOT5 = new NOT();
}
let output = {
output0: this.DLATCH3.compute(this.DLATCH4.compute(input0, this.NOT5.compute(input1).output0).output0, input1).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = DFLIPFLOP;