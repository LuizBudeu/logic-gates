// function SRLATCH(input0, input1) {
//     let output = {};
//     if (input0 == 0) {
//         if (input1 == 0) {
//             output.output0 = this.lastValue;
//         } else {
//             output.output0 = 0;
//         }
//     } else {
//         if (input1 == 0) {
//             output.output0 = 1;
//         } else {
//             output.output0 = 0;
//         }
//     }
//     this.lastValue = output.output0;
//     return output;
// }

// const NOR = (input0, input1) => {
//     let output = {
//         output0: !(input0 || input1),
//     };

//     this.lastValue0 = output.output0;
//     return output;
// };

// const SRLATCH = (input0, input1) => {
//     if (this.nor4 === undefined) {
//         this.nor4 = NOR;
//     }

//     if (this.nor3 === undefined) {
//         this.nor3 = NOR;
//     }
//     let output = {
//         output0: this.nor4(this.nor3(input0, this.nor4.lastValue0).output0, input1).output0,
//     };

//     this.lastValue0 = output.output0;

//     return output;
// };

// const srlatch = SRLATCH;

// console.log(srlatch(0, 0));
// console.log(srlatch(1, 0));
// console.log(srlatch(0, 0));
// console.log(srlatch(1, 0));
// console.log(srlatch(0, 0));
// console.log(srlatch(0, 1));

function NOR(input0, input1) {
    let output = {
        output0: !(input0 || input1),
    };

    this.lastValue0 = output.output0;
    return output;
}

function SRLATCH(input0, input1) {
    if (this.nor4 === undefined) {
        this.nor4 = NOR;
    }

    if (this.nor3 === undefined) {
        this.nor3 = NOR;
    }

    let output = {
        output0: this.nor4(this.nor3(input0, this.nor4.lastValue0).output0, input1).output0,
    };

    NOR.lastValue0 = output.output0;

    return output;
}

const srlatch = SRLATCH;

console.log(srlatch(0, 0));
console.log(srlatch(1, 0));
console.log(srlatch(0, 0));
console.log(srlatch(1, 0));
console.log(srlatch(0, 0));
console.log(srlatch(0, 1));
