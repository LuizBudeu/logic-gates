const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
function XOR (input0, input1) {
return {
output0: AND(OR(input0, input1).output0, NAND(input0, input1).output0).output0
};
}
module.exports = XOR;