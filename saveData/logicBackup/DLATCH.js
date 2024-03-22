const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
const NOR = require("./NOR");
function DLATCH() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        if (this.NOR3 === undefined) {
            this.NOR3 = new NOR();
        }
        if (this.NOR4 === undefined) {
            this.NOR4 = new NOR();
        }
        if (this.AND5 === undefined) {
            this.AND5 = new AND();
        }
        if (this.AND6 === undefined) {
            this.AND6 = new AND();
        }
        if (this.NOT7 === undefined) {
            this.NOT7 = new NOT();
        }
        let output = {
            output0: this.NOR4.compute(
                this.NOR3.compute(this.AND5.compute(input0, input1).output0, this.NOR4.lastOutput?.output0).output0,
                this.AND6.compute(input1, this.NOT7.compute(input0).output0).output0
            ).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = DLATCH;
