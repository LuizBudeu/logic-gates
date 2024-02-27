const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
const FOURBITADDER = require("./FOURBITADDER");
function ALU (input0, input1, input2, input3, input4, input5, input6, input7, input8) {
return {
output0: FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output0,
output1: FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output1,
output2: FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output2,
output3: FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output3,
output4: FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output4,
output5: FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output0,
output6: AND(AND(AND(NOT(FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output0).output0, NOT(FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output1).output0).output0, NOT(FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output2).output0).output0, NOT(FOURBITADDER(input0, input1, input2, input3, XOR(input4, input8).output0, XOR(input5, input8).output0, XOR(input6, input8).output0, XOR(input7, input8).output0, input8).output3).output0).output0
};
}
module.exports = ALU;