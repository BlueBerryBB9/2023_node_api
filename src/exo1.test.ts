import { describe, expect, test } from "@jest/globals";
import { toto_narrow } from "./exo1.js";

describe("exo1 module", () => {
    test("string", () => {
        expect(toto_narrow("Toi")).toBe("Toi bonjour!");
    });
    test("number", () => {
        expect(toto_narrow(1)).toBe(13);
    });
    test("string[] content", () => {
        let table: string[] = ["abf", "fe"];
        toto_narrow(table);
        expect(table).toStrictEqual([
            "abf",
            "fe",
            "je suis une chaîne supplémentaire",
        ]);
    });
    test("string[] return", () => {
        let table: string[] = [];
        expect(toto_narrow(table)).toStrictEqual(null);
    });
    test("number[] content empty", () => {
        let table: number[] = [];
        toto_narrow(table);
        expect(table).toStrictEqual([]);
    });
    test("number[] content", () => {
        let table: number[] = [1, 2];
        toto_narrow(table);
        expect(table).toStrictEqual([1, 2, 3]);
    });
});
