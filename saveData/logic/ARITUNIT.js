const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const XOR = require("./XOR");
const ADDER = require("./ADDER");
const SRLATCH = require("./SRLATCH");
const FOURBITADDER = require("./FOURBITADDER");
const AND4 = require("./AND4");
const AND8 = require("./AND8");
const ANDUNIT = require("./ANDUNIT");
const ORUNIT = require("./ORUNIT");
const AND3 = require("./AND3");
const OR4 = require("./OR4");
const MUX4_1 = require("./MUX4_1");
function ARITUNIT() {
    this.lastOutput = {};
    this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7, input8) {
        if (this.NOT16 === undefined) {
            this.NOT16 = new NOT();
        }
        if (this.NOT17 === undefined) {
            this.NOT17 = new NOT();
        }
        if (this.NOT18 === undefined) {
            this.NOT18 = new NOT();
        }
        if (this.NOT19 === undefined) {
            this.NOT19 = new NOT();
        }
        if (this.AND420 === undefined) {
            this.AND420 = new AND4();
        }
        if (this.XOR21 === undefined) {
            this.XOR21 = new XOR();
        }
        if (this.XOR22 === undefined) {
            this.XOR22 = new XOR();
        }
        if (this.XOR23 === undefined) {
            this.XOR23 = new XOR();
        }
        if (this.XOR24 === undefined) {
            this.XOR24 = new XOR();
        }
        if (this.FOURBITADDER25 === undefined) {
            this.FOURBITADDER25 = new FOURBITADDER();
        }
        let output = {
            output0: this.FOURBITADDER25.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR24.compute(input4, input8).output0,
                this.XOR23.compute(input5, input8).output0,
                this.XOR22.compute(input6, input8).output0,
                this.XOR21.compute(input7, input8).output0,
                input8
            ).output0,
            output1: this.FOURBITADDER25.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR24.compute(input4, input8).output0,
                this.XOR23.compute(input5, input8).output0,
                this.XOR22.compute(input6, input8).output0,
                this.XOR21.compute(input7, input8).output0,
                input8
            ).output1,
            output2: this.FOURBITADDER25.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR24.compute(input4, input8).output0,
                this.XOR23.compute(input5, input8).output0,
                this.XOR22.compute(input6, input8).output0,
                this.XOR21.compute(input7, input8).output0,
                input8
            ).output2,
            output3: this.FOURBITADDER25.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR24.compute(input4, input8).output0,
                this.XOR23.compute(input5, input8).output0,
                this.XOR22.compute(input6, input8).output0,
                this.XOR21.compute(input7, input8).output0,
                input8
            ).output3,
            output4: this.FOURBITADDER25.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR24.compute(input4, input8).output0,
                this.XOR23.compute(input5, input8).output0,
                this.XOR22.compute(input6, input8).output0,
                this.XOR21.compute(input7, input8).output0,
                input8
            ).output4,
            output5: this.FOURBITADDER25.compute(
                input0,
                input1,
                input2,
                input3,
                this.XOR24.compute(input4, input8).output0,
                this.XOR23.compute(input5, input8).output0,
                this.XOR22.compute(input6, input8).output0,
                this.XOR21.compute(input7, input8).output0,
                input8
            ).output0,
            output6: this.AND420.compute(
                this.NOT16.compute(
                    this.FOURBITADDER25.compute(
                        input0,
                        input1,
                        input2,
                        input3,
                        this.XOR24.compute(input4, input8).output0,
                        this.XOR23.compute(input5, input8).output0,
                        this.XOR22.compute(input6, input8).output0,
                        this.XOR21.compute(input7, input8).output0,
                        input8
                    ).output0
                ).output0,
                this.NOT17.compute(
                    this.FOURBITADDER25.compute(
                        input0,
                        input1,
                        input2,
                        input3,
                        this.XOR24.lastOutput?.output0,
                        this.XOR23.lastOutput?.output0,
                        this.XOR22.lastOutput?.output0,
                        this.XOR21.lastOutput?.output0,
                        input8
                    ).output1
                ).output0,
                this.NOT19.compute(
                    this.FOURBITADDER25.compute(
                        input0,
                        input1,
                        input2,
                        input3,
                        this.XOR24.lastOutput?.output0,
                        this.XOR23.lastOutput?.output0,
                        this.XOR22.lastOutput?.output0,
                        this.XOR21.lastOutput?.output0,
                        input8
                    ).output2
                ).output0,
                this.NOT18.compute(
                    this.FOURBITADDER25.compute(
                        input0,
                        input1,
                        input2,
                        input3,
                        this.XOR24.lastOutput?.output0,
                        this.XOR23.lastOutput?.output0,
                        this.XOR22.lastOutput?.output0,
                        this.XOR21.lastOutput?.output0,
                        input8
                    ).output3
                ).output0
            ).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = ARITUNIT;
