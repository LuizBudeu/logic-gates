function NAND(input0, input1) {
    return {
        output0: !(input0 && input1),
    };
}

function NOT(input0) {
    return {
        output0: NAND(input0, input0).output0,
    };
}

function OR(input0, input1) {
    if (this.NOT3 === undefined) {
        this.NOT3 = NOT;
    }
    if (this.NOT4 === undefined) {
        this.NOT4 = NOT;
    }
    if (this.NAND5 === undefined) {
        this.NAND5 = NAND;
    }
    let output = {
        output0: this.NAND5(this.NOT3(input0).output0, this.NOT4(input1).output0).output0,
    };
    this.lastValue0 = output.output0;
    return output;
}

function NOR(input0, input1) {
    if (this.NOT3 === undefined) {
        this.NOT3 = NOT;
    }
    if (this.OR4 === undefined) {
        this.OR4 = OR;
    }
    let output = {
        output0: this.NOT3(this.OR4(input0, input1).output0).output0,
    };
    NOR.lastOutput = output;
    return output;
}

function SRLATCH(input0, input1) {
    if (this.NOR3 === undefined) {
        this.NOR3 = NOR;
    }
    if (this.NOR4 === undefined) {
        this.NOR4 = NOR;
    }
    let output = {
        output0: this.NOR4(this.NOR3(input0, this.NOR4.lastOutput?.output0).output0, input1).output0,
    };
    SRLATCH.lastOutput = output;
    return output;
}

const srlatch = SRLATCH;

console.log(srlatch(0, 0));
console.log(srlatch(1, 0));
console.log(srlatch(0, 0));
console.log(srlatch(1, 0));
console.log(srlatch(0, 0));
console.log(srlatch(0, 1));
