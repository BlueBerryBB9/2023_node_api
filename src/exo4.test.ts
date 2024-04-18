import { describe, expect, test } from "@jest/globals";
import { mk_dates_every_minutes } from "./exo4.js";

describe("exo4 module", () => {
    test("mk_dates_every_minutes", () => {
        expect(
            mk_dates_every_minutes({
                date: new Date(2024, 3, 18, 12, 44),
                inc: 1,
                date_nb: 3,
            }),
        ).toStrictEqual([
            new Date("2024-04-18T10:44:00.000Z"),
            new Date("2024-04-18T10:45:00.000Z"),
            new Date("2024-04-18T10:46:00.000Z"),
            new Date("2024-04-18T10:47:00.000Z"),
        ]);
    });
});
