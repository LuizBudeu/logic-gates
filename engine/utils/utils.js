export function splitStringOnce(str, on) {
    const [first, ...rest] = str.split(on);
    return [first, rest.length > 0 ? rest.join(on) : null];
}
