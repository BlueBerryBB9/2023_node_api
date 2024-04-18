import { describe, expect, test } from "@jest/globals";
import { TimeSlot, mk_slots } from "./exo5.js";

describe("exo4 module", () => {
    test("mk_slots", () => {
        expect(
            mk_slots({
                date: new Date(2024, 3, 18, 12, 44),
                inc: 15,
                slot_nb: 1,
            }),
        ).toStrictEqual([
            {
                bgn_date: new Date(2024, 3, 18, 12, 44),
                end_date: new Date(2024, 3, 18, 12, 59),
            },
        ]);
    });
    test("mk_slots several", () => {
        expect(
            mk_slots({
                date: new Date(2024, 3, 18, 12, 44),
                inc: 15,
                slot_nb: 3,
            }),
        ).toStrictEqual([
            {
                bgn_date: new Date(2024, 3, 18, 12, 44),
                end_date: new Date(2024, 3, 18, 12, 59),
            },
            {
                bgn_date: new Date(2024, 3, 18, 12, 59),
                end_date: new Date(2024, 3, 18, 13, 14),
            },
            {
                bgn_date: new Date(2024, 3, 18, 13, 14),
                end_date: new Date(2024, 3, 18, 13, 29),
            },
        ]);
    });
});
