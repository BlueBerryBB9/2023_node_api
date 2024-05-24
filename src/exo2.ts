export type User = {
    name: string;
    id: number;
    login: string;
    yob: number;
};

export function users_add(x: User[], login: string, yob: number, name: string) {
    x.push({ id: x.length, login, yob, name });
}

export function users_get(
    users: User[],
    index: { login: string } | { id: number },
) {
    let res;

    if ("login" in index)
        res = users.find((elem) => elem["login"] === index.login);
    else if ("id" in index) res = users.find((elem) => elem["id"] === index.id);

    return res === undefined ? null : res;
}

export function users_logins(users: User[]) {
    let login_array: string[] = [];
    users.forEach((value: User) => login_array.push(value.login));
    return login_array;
}

export function users_name_by_birth_year(users: User[]) {
    let another = users.slice().sort((a, b) => a.yob - b.yob);
    return another.map((user) => {
        return { name: user.name, yob: user.yob };
    });
}
