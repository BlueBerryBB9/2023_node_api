function is_str_array(x: any[]): x is string[] {
    return !x.find((elem) => typeof elem !== "string");
}

export function toto_narrow(x: string | number | string[] | number[]) {
    if (typeof x === "string") {
        return x + " bonjour!";
    } else if (typeof x === "number") {
        return x + 12;
    } else if (is_str_array(x)) {
        x.push("je suis une chaîne supplémentaire");
        return null;
    } else {
        x.push(x.reduce((acc, curr) => acc + curr));
        return null;
    }
}
