export type User = {
    id: number;
    login: string;
    yob: number;
};

export function users_add(x: User[], login: string, yob: number) {
    x.push({ id: x.length, login, yob });
}

// export function users_get(x: User[], index: string | number) {
//     return x.find(
//         (elem) => elem[typeof index === "string" ? "login" : "id"] === index,
//     )
//         ? x.find(
//               (elem) =>
//                   elem[typeof index === "string" ? "login" : "id"] === index,
//           )
//         : null;
// }

export function users_get(
    users: User[],
    index: { login: string } | { id: number },
) {
    if ("login" in index) {
        var res = users.find((elem) => elem["login"] === index.login);
    } else if ("id" in index) {
        var res = users.find((elem) => elem["id"] === index.id);
    }
    return res === undefined ? null : res;
}

export function users_logins(users: User[]) {
    let login_array: string[] = [];
    users.forEach((value: User) => login_array.push(value.login));
    return login_array;
}

export function users_name_by_birth_year(users: User[]) {
    let another: User[] = JSON.parse(JSON.stringify(users));
    another.sort((a, b) => a.yob - b.yob);
    return another;
}
