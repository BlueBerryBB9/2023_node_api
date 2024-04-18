import { describe, expect, test } from "@jest/globals";
import { sum } from "./sum.js";

describe("sum module", () => {
    test("2 values", () => {
        expect(sum([1, 2])).toBe(3);
    });
    test("3 values", () => {
        expect(sum([1, 2, 3])).toBe(6);
    });
    test("empty", () => {
        expect(sum([])).toBe(0);
    });
});
