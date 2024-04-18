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

        expect(user_array).toBe([]);
    });
});
