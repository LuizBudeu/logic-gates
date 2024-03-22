const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
const DLATCH = require("./DLATCH");
function REGISTER() {
    this.lastOutput = {};
    this.compute = function (input0, input1, input2, input3, input4) {
        if (this.DLATCH3 === undefined) {
            this.DLATCH3 = new DLATCH();
        }
        if (this.DLATCH4 === undefined) {
            this.DLATCH4 = new DLATCH();
        }
        if (this.DLATCH5 === undefined) {
            this.DLATCH5 = new DLATCH();
        }
        if (this.DLATCH6 === undefined) {
            this.DLATCH6 = new DLATCH();
        }
        let output = {
            output0: this.DLATCH3.compute(input0, input4).output0,
            output1: this.DLATCH4.compute(input1, input4).output0,
            output2: this.DLATCH5.compute(input2, input4).output0,
            output3: this.DLATCH6.compute(input3, input4).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = REGISTER;
