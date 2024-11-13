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
function AND8 () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7) {
if (this.AND43 === undefined) {
this.AND43 = new AND4();
}
if (this.AND44 === undefined) {
this.AND44 = new AND4();
}
if (this.AND11 === undefined) {
this.AND11 = new AND();
}
let output = {
output0: this.AND11.compute(this.AND43.compute(input0, input1, input2, input3).output0, this.AND44.compute(input4, input5, input6, input7).output0).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = AND8;