function SRLatch(input0, input1) {
    return {
        output0: NOR(NOR(input0, NOR.output0).output0, input1).output0,
    };
}
