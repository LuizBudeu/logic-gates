const NAND = require("./NAND");
function NOT() {
    this.lastOutput = {};
    this.compute = function (input0) {
        if (this.NAND3 === undefined) {
            this.NAND3 = new NAND();
        }
        let output = {
            output0: this.NAND3.compute(input0, input0).output0,
        };
        this.lastOutput = output;
        return output;
    };
}
module.exports = NOT;
