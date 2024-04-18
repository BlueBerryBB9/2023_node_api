export function mk_login(login: string) {
    login = login
        .toLowerCase()
        .trim()
        .replace(" ", ".")
        .replaceAll(" ", "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return login;
}
