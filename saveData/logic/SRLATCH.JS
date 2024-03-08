function SRLATCH(input0, input1) {
    let output = {
        output0: NOR(NOR(input0, this.lastValue0).output0, input1).output0,
    };

    this.lastValue0 = output.output0;

    return output;
}

module.exports = SRLATCH;
