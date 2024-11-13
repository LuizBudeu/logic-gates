const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const XOR = require("./XOR");
const FOURBITADDER = require("./FOURBITADDER");
function ALU() {
    this.lastOutput = {};
    this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7, input8) {
        if (this.FOURBITADDER16 === undefined) {
            this.FOURBITADDER16 = new FOURBITADDER();
        }
        if (this.XOR17 === undefined) {
            this.XOR17 = new XOR();
        }
        if (this.XOR18 === undefined) {
            this.XOR18 = new XOR();
        }
        if (this.XOR19 === undefined) {
            this.XOR19 = new XOR();
        }
        if (this.XOR20 === undefined) {
            this.XOR20 = new XOR();
        }
        if (this.NOT21 === undefined) {
            this.NOT21 = new NOT();
        }
        if (this.NOT22 === undefined) {
            this.NOT22 = new NOT();
        }
        if (this.NOT23 === undefined) {
            this.NOT23 = new NOT();
        }
        if (this.NOT24 === undefined) {
            this.NOT24 = new NOT();
        }
        if (this.AND25 === undefined) {
            this.AND25 = new AND();
        }
        if (this.AND26 === undefined) {
            this.AND26 = new AND();
        }
        if (this.AND27 === undefined) {
            this.AND27 = new AND();
        }
        let output = {
            output0: this.FOURBITADDER16.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR20.compute(input4, input8).output0,
                this.XOR19.compute(input5, input8).output0,
                this.XOR18.compute(input6, input8).output0,
                this.XOR17.compute(input7, input8).output0,
                input8
            ).output0,
            output1: this.FOURBITADDER16.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR20.compute(input4, input8).output0,
                this.XOR19.compute(input5, input8).output0,
                this.XOR18.compute(input6, input8).output0,
                this.XOR17.compute(input7, input8).output0,
                input8
            ).output1,
            output2: this.FOURBITADDER16.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR20.compute(input4, input8).output0,
                this.XOR19.compute(input5, input8).output0,
                this.XOR18.compute(input6, input8).output0,
                this.XOR17.compute(input7, input8).output0,
                input8
            ).output2,
            output3: this.FOURBITADDER16.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR20.compute(input4, input8).output0,
                this.XOR19.compute(input5, input8).output0,
                this.XOR18.compute(input6, input8).output0,
                this.XOR17.compute(input7, input8).output0,
                input8
            ).output3,
            output4: this.FOURBITADDER16.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR20.compute(input4, input8).output0,
                this.XOR19.compute(input5, input8).output0,
                this.XOR18.compute(input6, input8).output0,
                this.XOR17.compute(input7, input8).output0,
                input8
            ).output4,
            output5: this.FOURBITADDER16.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR20.compute(input4, input8).output0,
                this.XOR19.compute(input5, input8).output0,
                this.XOR18.compute(input6, input8).output0,
                this.XOR17.compute(input7, input8).output0,
                input8
            ).output0,
            output6: this.AND27.compute(
                this.AND26.compute(
                    this.AND25.compute(
                        this.NOT22.compute(
                            this.FOURBITADDER16.compute(
                                input0,
                                input1,
                                input2,
                                input3,
                                this.XOR20.compute(input4, input8).output0,
                                this.XOR19.compute(input5, input8).output0,
                                this.XOR18.compute(input6, input8).output0,
                                this.XOR17.compute(input7, input8).output0,
                                input8
                            ).output0
                        ).output0,
                        this.NOT21.compute(
                            this.FOURBITADDER16.compute(
                                input0,
                                input1,
                                input2,
                                input3,
                                this.XOR20.lastOutput?.output0,
                                this.XOR19.lastOutput?.output0,
                                this.XOR18.lastOutput?.output0,
                                this.XOR17.lastOutput?.output0,
                                input8
                            ).output1
                        ).output0
                    ).output0,
                    this.NOT23.compute(
                        this.FOURBITADDER16.compute(
                            input0,
                            input1,
                            input2,
                            input3,
                            this.XOR20.lastOutput?.output0,
                            this.XOR19.lastOutput?.output0,
                            this.XOR18.lastOutput?.output0,
                            this.XOR17.lastOutput?.output0,
                            input8
                        ).output2
                    ).output0
                ).output0,
                this.NOT24.compute(
                    this.FOURBITADDER16.compute(
                        input0,
                        input1,
                        input2,
                        input3,
                        this.XOR20.lastOutput?.output0,
                        this.XOR19.lastOutput?.output0,
                        this.XOR18.lastOutput?.output0,
                        this.XOR17.lastOutput?.output0,
                        input8
                    ).output3
                ).output0
            ).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = ALU;
