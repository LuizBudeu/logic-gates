const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
function TEST (input0, input1) {
return {
output0: NOT(NAND(input0, input0).output0).output0,
output1: NAND(input1, NOT(NOT(input1).output0).output0).output0
};
}
module.exports = TEST;