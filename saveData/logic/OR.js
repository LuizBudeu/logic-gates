const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
function OR (input0, input1) {
return {
output0: NAND(NOT(input0).output0, NOT(input1).output0).output0
};
}
module.exports = OR;