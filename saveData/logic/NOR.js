const NAND = require("./NAND");
const NOT = require("./NOT");
const AND = require("./AND");
const OR = require("./OR");
function NOR () {
this.lastOutput = {};
this.compute = function (input0, input1) {
if (this.OR3 === undefined) {
this.OR3 = new OR();
}
if (this.NOT4 === undefined) {
this.NOT4 = new NOT();
}
let output = {
output0: this.NOT4.compute(this.OR3.compute(input0, input1).output0).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = NOR;