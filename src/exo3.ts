export function mk_login(login: string) {
    login = login.toLowerCase();
    login = login.trim();
    login = login.replace(" ", ".");
    login = login.replaceAll(" ", "");
    login = login.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return login;
}
