const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
function FOURBITADDER(input0, input1, input2, input3, input4, input5, input6, input7, input8) {
    return {
        output0: ADDER(input0, input4, ADDER(input1, input5, ADDER(input2, input6, ADDER(input3, input7, input8).output1).output1).output1).output0,
        output1: ADDER(input1, input5, ADDER(input2, input6, ADDER(input3, input7, input8).output1).output1).output0,
        output2: ADDER(input2, input6, ADDER(input3, input7, input8).output1).output0,
        output3: ADDER(input3, input7, input8).output0,
        output4: ADDER(input0, input4, ADDER(input1, input5, ADDER(input2, input6, ADDER(input3, input7, input8).output1).output1).output1).output1,
    };
}
module.exports = FOURBITADDER;
