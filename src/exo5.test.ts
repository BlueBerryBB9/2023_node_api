import { describe, expect, test } from "@jest/globals";
import { TimeSlot, mk_slots } from "./exo5.js";

describe("exo5 module", () => {
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
    test("mk_slots several + space", () => {
        expect(
            mk_slots({
                date: new Date(2024, 3, 18, 12, 44),
                inc: 15,
                slot_nb: 3,
                space: 3,
            }),
        ).toStrictEqual([
            {
                bgn_date: new Date(2024, 3, 18, 12, 44),
                end_date: new Date(2024, 3, 18, 12, 59),
            },
            {
                bgn_date: new Date(2024, 3, 18, 13, 2),
                end_date: new Date(2024, 3, 18, 13, 17),
            },
            {
                bgn_date: new Date(2024, 3, 18, 13, 20),
                end_date: new Date(2024, 3, 18, 13, 35),
            },
        ]);
    });
    test("mk_slots several pause", () => {
        expect(
            mk_slots({
                date: new Date(2024, 3, 18, 12, 44),
                inc: 15,
                slot_nb: 3,
                pause_rate: 2,
                pause_time: 30,
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
                bgn_date: new Date(2024, 3, 18, 13, 44),
                end_date: new Date(2024, 3, 18, 13, 59),
            },
        ]);
    });
    test("mk_slots several space + pause", () => {
        expect(
            mk_slots({
                date: new Date(2024, 3, 18, 12, 44),
                inc: 15,
                slot_nb: 4,
                pause_rate: 2,
                pause_time: 30,
                space: 3,
            }),
        ).toStrictEqual([
            {
                bgn_date: new Date(2024, 3, 18, 12, 44),
                end_date: new Date(2024, 3, 18, 12, 59),
            },
            {
                bgn_date: new Date(2024, 3, 18, 13, 2),
                end_date: new Date(2024, 3, 18, 13, 17),
            },
            {
                bgn_date: new Date(2024, 3, 18, 13, 47),
                end_date: new Date(2024, 3, 18, 14, 2),
            },
            {
                bgn_date: new Date(2024, 3, 18, 14, 5),
                end_date: new Date(2024, 3, 18, 14, 20),
            },
        ]);
    });
});
