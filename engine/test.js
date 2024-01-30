function splitStringOnce(str, on) {
    const [first, ...rest] = str.split(on);
    return [first, rest.length > 0 ? rest.join(on) : null];
}

// let gates = {
//     NAND: "(input0, input1) => {return !(input0 && input1);};",
//     NOT: "(input0) => {const result1 = NAND(input0,input0);return result1;};",
//     OR: "(input0, input1) => {const result1 = NOT(input0);const result2 = NOT(input1);const result3 = NAND(result1,result2);return result3;};",
//     AND: "(input0, input1) => {const result1 = NAND(input0,input1);const result2 = NOT(result1);return result2;};",
//     XOR: "(input0, input1) => {const result1 = OR(input0,input1);const result2 = NAND(input1,input0);const result3 = AND(result1,result2);return result3;};",
//     ADDER: "(input0, input1, input2) => {const result1 = XOR(input0,input1);const result2 = XOR(result1,input2);const result3 = XOR(input0,input1);const result4 = AND(result3,input2);const result5 = AND(input1,input0);const result6 = OR(result4,result5);return result6;};",
// };

let gates = {
    NAND: `(input0, input1) => {const output = {}; const result1 = !(input0 && input1); output["output0"] = result1; return output };`,
    NOT: `(input0) => { const output = {};const result1 = NAND(input0,input0);output["output0"] = result1;return output;};`,
};

// let gatesHydrated = {
//     NAND: "(input0, input1) => {return !(input0 && input1);};",
//     NOT: "(input0) => {const NAND = (input0, input1) => {return !(input0 && input1);}; const result1 = NAND(input0,input0);return result1;};",
//     OR: "(input0, input1) => {const NAND = (input0, input1) => {return !(input0 && input1);}; const NOT = (input0) => {const NAND = (input0, input1) => {return !(input0 && input1);}; const result1 = NAND(input0,input0);return result1;};; const result1 = NOT(input0);const result2 = NOT(input1);const result3 = NAND(result1,result2);return result3;};",
// };

function hydrateGates(gates) {
    let keys = Object.keys(gates);
    let gatesHydrated = {};
    let paramCounts = {};

    // Get the number of parameters for each gate
    for (let i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        let currentDefinition = gates[currentKey];
        let params = splitStringOnce(currentDefinition, " => {");
        let paramCount = params[0].split(",").length;

        paramCounts[currentKey] = paramCount;
    }

    // Hydrate the gates with previous definitions
    for (let i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        let currentDefinition = gates[currentKey];
        let previousDefinitions = keys
            .slice(0, i)
            .map((key) => `${key} = ${gates[key]}`)
            .join("const ");

        // Generate the function signature based on the number of parameters
        let params = Array.from({ length: paramCounts[currentKey] }, (_, i) => `input${i}`).join(", ");

        currentDefinition = currentDefinition.replace(`(${params})`, "");
        if (previousDefinitions.length > 0) {
            currentDefinition = currentDefinition.replace("=> {", "");
        }

        let constPreviousDefinition = previousDefinitions.length > 0 ? `const ${previousDefinitions};` : "";
        let fullString = previousDefinitions.length > 0 ? `(${params}) => { ${constPreviousDefinition}; ${currentDefinition}` : `(${params})${currentDefinition}`;

        gatesHydrated[currentKey] = fullString;
    }

    return gatesHydrated;
}

let gatesHydrated = hydrateGates(gates);

console.log(gatesHydrated);

const and = (input0, input1) => {
    const NAND = (input0, input1) => {
        const output = {};
        const result1 = !(input0 && input1);
        output["output0"] = result1;
        return output;
    };
    const NOT = (input0) => {
        const output = {};
        const result0 = NAND(input0, input0);
        output["output0"] = result0["output0"];
        return output;
    };
    const output = {};
    const result0 = NAND(input0, input1);
    const result1 = NOT(...result1);
    output["output0"] = result1["output1"];
    return output;
};

const not = (input0) => {
    const NAND = (input0, input1) => {
        const output = {};
        const result1 = !(input0 && input1);
        output["output0"] = result1;
        return output;
    };
    const output = {};
    const result0 = NAND(input0, input0);
    output["output0"] = result0["output0"];
    return output;
};
