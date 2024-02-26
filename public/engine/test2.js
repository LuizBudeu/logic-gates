// const AND = (input0, input1) => {
//     const NAND = (input0, input1) => {
//         const output = {};
//         const result0 = !(input0 && input1);
//         output["output0"] = result0;
//         return output;
//     };
//     const NOT = (input0) => {
//         const output = {};
//         const result0 = NAND(input0, input0);
//         output["output0"] = result0["output0"];
//         return output;
//     };
//     const output = {};
//     const result0 = NAND(input0, input1);
//     const result1 = NOT(result0["output0"]);
//     output["output0"] = result1["output0"];
//     return output;
// };

// const and2 = (input0, input1) => {
//     const NAND = (input0, input1) => {
//         const output = {};
//         const result1 = !(input0 && input1);
//         output["output0"] = result1;
//         return output;
//     };
//     const NOT = (input0) => {
//         const output = {};
//         const result1 = NAND(input0, input0);
//         output["output0"] = result1["output0"];
//         return output;
//     };
//     const output = {};
//     const result0 = NAND(input0, input1);
//     const result1 = NOT(result0["output0"]);
//     output["output0"] = result1["output0"];
//     return output;
// };

// const and3 = (input0, input1) => {
//     const NAND = (input0, input1) => {
//         const output = {};
//         const result1 = !(input0 && input1);
//         output["output0"] = result1;
//         return output;
//     };
//     const NOT = (input0) => {
//         const output = {};
//         const result1 = NAND(input0, input0);
//         output["output0"] = result1["output0"];
//         return output;
//     };
//     const output = {};
//     const result0 = NAND(input0, input1);
//     const result1 = NOT(result0["output0"]);
//     output["output0"] = result1["output0"];
//     return output;
// };

// const and4 = (input0, input1) => {
//     const NAND = (input0, input1) => {
//         const output = {};
//         const result1 = !(input0 && input1);
//         output["output0"] = result1;
//         return output;
//     };
//     const NOT = (input0) => {
//         const output = {};
//         const result1 = NAND(input0, input0);
//         output["output0"] = result1["output0"];
//         return output;
//     };
//     const output = {};
//     const result0 = NAND(input0, input1);
//     const result1 = NOT(result0["output0"]);
//     output["output0"] = result1["output0"];
//     return output;
// };

// console.log(and3(1, 1));

function NAND(input0, input1) {
    return {
        output0: !(input0 && input1),
    };
}
function NOT(input0) {
    return {
        output0: NAND(input0, input0).output0,
    };
}

function TEST(input0, input1) {
    return {
        output0: NOT(NAND(input0, input0).output0).output0,
        output1: NAND(input1, NOT(NOT(input1).output0).output0).output0,
    };
}
console.log(TEST(1, 1));

// function TEST(input0, input1) {
//     return {
//         output0: NOT(NAND(input0, input1).output0).output0,
//         output1: NOT(input1).output0,
//     };
// }

// function TEST(input0, input1) {
//     return {
//         output0: NAND(input0, input0).output0,
//         output1: NOT(input1).output0,
//     };
// }

// function AND(input0, input1) {
//     return {
//         output0: NOT(NAND(input0, input1).output0).output0,
//     };
// }
// console.log(AND(0, 1));
