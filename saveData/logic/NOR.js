const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const XOR = require("./XOR");
function NOR (input0, input1) {
return {
output0: NOT(OR(input0, input1).output0).output0
};
}
module.exports = NOR;