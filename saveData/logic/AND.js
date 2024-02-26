const NAND = require("./NAND");
const NOT = require("./NOT");

function AND(input0, input1) {
    return NOT(NAND(input0, input1));
}

module.exports = AND;
