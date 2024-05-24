import { describe, expect, test } from "@jest/globals";
import { mk_login } from "./exo3.js";

describe("exo3 module", () => {
    test("mk_login", () => {
        expect(mk_login("Élise Philippe")).toBe("elise.philippe");
        expect(mk_login(" ÉlIsE     PHilIppe  ")).toBe("elise.philippe");
        expect(mk_login(".mArTin . LeroY.  ")).toBe("martin.leroy");
        expect(mk_login("Martin Leroy")).toBe("martin.leroy");
    });
});
