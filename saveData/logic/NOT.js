const NAND = require("./NAND");

function NOT(input0) {
    return {
        output0: NAND(input0, input0).output0,
    };
}

module.exports = NOT;
