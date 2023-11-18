function AND(...args) {
    return args.reduce((a, b) => a && b);
}

function NAND(...args) {
    return !AND(...args);
}

function OR(...args) {
    return args.reduce((a, b) => a || b);
}

function NOR(...args) {
    return !OR(...args);
}

function NOT(a) {
    return !a;
}

export { AND, NAND, NOR, OR, NOT };
