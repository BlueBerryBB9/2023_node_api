export type User = {
    id: number;
    name: string;
    yob: number;
};

export function users_add(x: User[], name: string, yob: number) {
    x.push({ id: x.length, name, yob });
}

export function users_get(x: User[], index: string | number) {
    return x.find(
        (elem) => elem[typeof index === "string" ? "name" : "id"] === index,
    )
        ? x.find(
              (elem) =>
                  elem[typeof index === "string" ? "name" : "id"] === index,
          )
        : null;
}
