function NAND(input0, input1) {
    return {
        output0: !(input0 && input1),
    };
}

module.exports = NAND;
