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
function FOURBIT_MUX4_1() {
    this.lastOutput = {};
    this.compute = function (input0, input1, input2, input3, input4, input5, input6, input7, input8, input9, input10, input11, input12, input13, input14, input15, input16, input17) {
        if (this.MUX4_122 === undefined) {
            this.MUX4_122 = new MUX4_1();
        }
        if (this.MUX4_123 === undefined) {
            this.MUX4_123 = new MUX4_1();
        }
        if (this.MUX4_124 === undefined) {
            this.MUX4_124 = new MUX4_1();
        }
        if (this.MUX4_125 === undefined) {
            this.MUX4_125 = new MUX4_1();
        }
        let output = {
            output0: this.MUX4_122.compute(input0, input4, input8, input12, input16, input17).output0,
            output1: this.MUX4_123.compute(input1, input5, input9, input13, input16, input17).output0,
            output2: this.MUX4_124.compute(input2, input6, input10, input14, input16, input17).output0,
            output3: this.MUX4_125.compute(input3, input7, input11, input15, input16, input17).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = FOURBIT_MUX4_1;
