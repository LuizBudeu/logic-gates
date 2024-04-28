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
const ARITUNIT = require("./ARITUNIT");
const NOT4 = require("./NOT4");
const FOURBIT_MUX4_1 = require("./FOURBIT_MUX4_1");
function ALU() {
    this.lastOutput = {};
    this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7, input8, input9) {
        if (this.FOURBIT_MUX4_114 === undefined) {
            this.FOURBIT_MUX4_114 = new FOURBIT_MUX4_1();
        }
        if (this.ARITUNIT15 === undefined) {
            this.ARITUNIT15 = new ARITUNIT();
        }
        if (this.ORUNIT17 === undefined) {
            this.ORUNIT17 = new ORUNIT();
        }
        if (this.ANDUNIT18 === undefined) {
            this.ANDUNIT18 = new ANDUNIT();
        }
        if (this.AND19 === undefined) {
            this.AND19 = new AND();
        }
        if (this.NOT20 === undefined) {
            this.NOT20 = new NOT();
        }
        let output = {
            output0: this.FOURBIT_MUX4_114.compute(
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output0,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output1,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output2,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output3,
                this.ARITUNIT15.lastOutput?.output0,
                this.ARITUNIT15.lastOutput?.output1,
                this.ARITUNIT15.lastOutput?.output2,
                this.ARITUNIT15.lastOutput?.output3,
                input8,
                input9
            ).output0,
            output1: this.FOURBIT_MUX4_114.compute(
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output0,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output1,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output2,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output3,
                this.ARITUNIT15.lastOutput?.output0,
                this.ARITUNIT15.lastOutput?.output1,
                this.ARITUNIT15.lastOutput?.output2,
                this.ARITUNIT15.lastOutput?.output3,
                input8,
                input9
            ).output1,
            output2: this.FOURBIT_MUX4_114.compute(
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output0,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output1,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output2,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output3,
                this.ARITUNIT15.lastOutput?.output0,
                this.ARITUNIT15.lastOutput?.output1,
                this.ARITUNIT15.lastOutput?.output2,
                this.ARITUNIT15.lastOutput?.output3,
                input8,
                input9
            ).output2,
            output3: this.FOURBIT_MUX4_114.compute(
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ORUNIT17.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output0,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output1,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output2,
                this.ANDUNIT18.compute(input0, input1, input2, input3, input4, input5, input6, input7).output3,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output0,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output1,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output2,
                this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.lastOutput?.output0).output3,
                this.ARITUNIT15.lastOutput?.output0,
                this.ARITUNIT15.lastOutput?.output1,
                this.ARITUNIT15.lastOutput?.output2,
                this.ARITUNIT15.lastOutput?.output3,
                input8,
                input9
            ).output3,
            output4: this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output4,
            output5: this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output5,
            output6: this.ARITUNIT15.compute(input0, input1, input2, input3, input4, input5, input6, input7, this.AND19.compute(this.NOT20.compute(input8).output0, input9).output0).output6,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = ALU;
