function SRLatch(input0, input1) {
    output = {
        output0: NOR(NOR(input0, this.lastValue).output0, input1).output0,
    };

    this.lastValue = output.output0;

    return output;
}
