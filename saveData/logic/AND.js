const NAND = require("./NAND");
const NOT = require("./NOT");

function AND(input0, input1) {
    return {
        output0: NOT(NAND(input0, input1).output0).output0,
    };
}

module.exports = AND;
