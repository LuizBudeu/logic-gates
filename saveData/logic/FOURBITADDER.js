const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
const SRLATCH = require("./SRLATCH");
function FOURBITADDER () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7, input8) {
if (this.ADDER14 === undefined) {
this.ADDER14 = new ADDER();
}
if (this.ADDER15 === undefined) {
this.ADDER15 = new ADDER();
}
if (this.ADDER16 === undefined) {
this.ADDER16 = new ADDER();
}
if (this.ADDER17 === undefined) {
this.ADDER17 = new ADDER();
}
let output = {
output0: this.ADDER17.compute(input0, input4, this.ADDER16.compute(input1, input5, this.ADDER15.compute(input2, input6, this.ADDER14.compute(input3, input7, input8).output1).output1).output1).output0,
output1: this.ADDER16.compute(input1, input5, this.ADDER15.compute(input2, input6, this.ADDER14.compute(input3, input7, input8).output1).output1).output0,
output2: this.ADDER15.compute(input2, input6, this.ADDER14.compute(input3, input7, input8).output1).output0,
output3: this.ADDER14.compute(input3, input7, input8).output0,
output4: this.ADDER17.compute(input0, input4, this.ADDER16.compute(input1, input5, this.ADDER15.compute(input2, input6, this.ADDER14.compute(input3, input7, input8).output1).output1).output1).output1
};
this.lastOutput = output;
return output;
};
}
module.exports = FOURBITADDER;