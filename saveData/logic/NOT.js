const NAND = require("./NAND");

function NOT(input0) {
    return NAND(input0, input0);
}

module.exports = NOT;
