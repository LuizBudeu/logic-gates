export function splitStringOnce(str, on) {
    const [first, ...rest] = str.split(on);
    return [first, rest.length > 0 ? rest.join(on) : null];
}

export function getAllNumbersFromString(str) {
    let matches = str.match(/\d+/g);
    matches = matches.join("");
    return matches;
}
