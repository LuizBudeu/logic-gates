const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const XOR = require("./XOR");
function ADDER (input0, input1, input2) {
return {
output0: XOR(input2, XOR(input0, input1).output0).output0,
output1: OR(AND(XOR(input0, input1).output0, input2).output0, AND(input1, input0).output0).output0
};
}
module.exports = ADDER;