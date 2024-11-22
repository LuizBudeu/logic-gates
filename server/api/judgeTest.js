function NAND() {
    this.lastOutput = null;
    this.compute = function (input0, input1) {
        let output = {
            output0: !(input0 && input1),
        };
        this.lastOutput = output;
        return output;
    };
}

new NAND();

function NOT() {
    this.lastOutput = {};
    this.compute = function (input0) {
        if (this.NAND3 === undefined) {
            this.NAND3 = new NAND();
        }
        let output = {
            output0: this.NAND3.compute(input0, input0).output0
        };
        this.lastOutput = output;
        return output;
    };
}

function AND() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        if (this.NOT3 === undefined) {
            this.NOT3 = new NOT();
        }
        if (this.NAND4 === undefined) {
            this.NAND4 = new NAND();
        }
        let output = {
            output0: this.NOT3.compute(this.NAND4.compute(input0, input1).output0).output0
        };
        this.lastOutput = output;
        return output;
    };
}

function NOR() {
    this.lastOutput = {};
    this.compute = function (input0, input1) {
        if (this.NOT3 === undefined) {
            this.NOT3 = new NOT();
        }
        if (this.NOT4 === undefined) {
            this.NOT4 = new NOT();
        }
        if (this.AND5 === undefined) {
            this.AND5 = new AND();
        }
        let output = {
            output0: this.AND5.compute(this.NOT3.compute(input0).output0, this.NOT4.compute(input1).output0).output0
        };
        this.lastOutput = output;
        return output;
    };
}

function NOT2() {
    this.lastOutput = {};
    this.compute = function (input0) {
        if (this.NOT3 === undefined) {
            this.NOT3 = new NOT();
        }
        let output = {
            output0: this.NOT3.compute(input0).output0
        };
        this.lastOutput = output;
        return output;
    };
}
;

function JUDGE_TEST() {
    this.lastOutput = {};
    this.compute = function (input0) {
        if (this.NOT3 === undefined) {
            this.NOT3 = new NOT();
        }
        let output = {
            output0: this.NOT3.compute(input0).output0
        };
        this.lastOutput = output;
        return output;
    };
};


const tests = [
    {"in0": 0, "out0": 1},
    {"in0": 1, "out0": 0}
]


const j = new JUDGE_TEST();

const points_per_test = 10 / tests.length

let total_points = 0;

let i = 0;
while (i < tests.length) {
    const test = tests[i];
    const inputs = [];
    const outs = {};

    for (const key in test) {
        if (test.hasOwnProperty(key)) {
            if (key.indexOf("in") === 0) {
                inputs.push(test[key])
            } else if (key.indexOf("out") === 0) {
                outs['output' + key.replace('out', '')] = !!test[key]
            }
        }
    }

    const results = j.compute.apply(this, inputs)

    for (const key in results) {
        if (results[key] === outs[key]) {
            total_points += points_per_test;
        }
    }
    i++;
}
console.log(total_points)
