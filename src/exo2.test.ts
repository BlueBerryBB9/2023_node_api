import { describe, expect, test } from "@jest/globals";
import {
    User,
    users_add,
    users_get,
    users_logins,
    users_name_by_birth_year,
} from "./exo2.js";

describe("exo2 module", () => {
    test("users_add", () => {
        let user_array: User[] = [];

        users_add(user_array, "martin.leroy", 2004, "Martin Leroy");
        expect(user_array).toStrictEqual([
            { id: 0, login: "martin.leroy", yob: 2004, name: "Martin Leroy" },
        ]);
    });
    test("users_get found", () => {
        let user_array: User[] = [];

        users_add(user_array, "martin.leroy", 2004, "Martin Leroy");

        expect(users_get(user_array, { id: 0 })).toStrictEqual({
            id: 0,
            login: "martin.leroy",
            yob: 2004,
            name: "Martin Leroy",
        });

        expect(users_get(user_array, { login: "martin.leroy" })).toStrictEqual({
            id: 0,
            login: "martin.leroy",
            yob: 2004,
            name: "Martin Leroy",
        });
    });
    test("users_get not found", () => {
        let user_array: User[] = [];

        users_add(user_array, "martin.leroy", 2004, "Martin Leroy");

        expect(users_get(user_array, { id: 1 })).toBe(null);
        expect(users_get(user_array, { login: "noah.chantin" })).toBe(null);
    });
    test("users_logins", () => {
        let user_array: User[] = [];

        users_add(user_array, "martin.leroy", 2004, "Martin Leroy");
        users_add(user_array, "noah.chantin", 2005, "Noah Chantin");
        users_add(user_array, "victor.vandeputte", 2003, "Victor Vandeputte");

        expect(users_logins(user_array)).toStrictEqual([
            "martin.leroy",
            "noah.chantin",
            "victor.vandeputte",
        ]);
    });
    test("users_name_by_birth_year", () => {
        let user_array: User[] = [];

        users_add(user_array, "martin.leroy", 2004, "Martin Leroy");
        users_add(user_array, "noah.chantin", 2005, "Noah Chantin");
        users_add(user_array, "victor.vandeputte", 2003, "Victor Vandeputte");

        expect(users_name_by_birth_year(user_array)).toStrictEqual([
            { name: "Victor Vandeputte", yob: 2003 },
            { name: "Martin Leroy", yob: 2004 },
            { name: "Noah Chantin", yob: 2005 },
        ]);
    });
});
