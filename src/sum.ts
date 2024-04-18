export function sum(values: number[]) {
    if (!values.length) return 0;

    return values.reduce((acc, val) => acc + val);
}
