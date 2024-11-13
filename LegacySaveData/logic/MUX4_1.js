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
function MUX4_1 () {
this.lastOutput = {};
this.compute = function (input0, input1, input2, input3, input4, input5) {
if (this.AND37 === undefined) {
this.AND37 = new AND3();
}
if (this.AND38 === undefined) {
this.AND38 = new AND3();
}
if (this.AND39 === undefined) {
this.AND39 = new AND3();
}
if (this.AND310 === undefined) {
this.AND310 = new AND3();
}
if (this.NOT11 === undefined) {
this.NOT11 = new NOT();
}
if (this.NOT12 === undefined) {
this.NOT12 = new NOT();
}
if (this.OR413 === undefined) {
this.OR413 = new OR4();
}
let output = {
output0: this.OR413.compute(this.AND310.compute(input4, input5, input0).output0, this.AND37.compute(input1, input4, this.NOT12.compute(input5).output0).output0, this.AND38.compute(this.NOT11.compute(input4).output0, input5, input2).output0, this.AND39.compute(this.NOT11.lastOutput?.output0, input3, this.NOT12.lastOutput?.output0).output0).output0
};
this.lastOutput = output;
return output;
};
}
module.exports = MUX4_1;