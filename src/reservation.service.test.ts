import { createDiffieHellmanGroup } from "crypto";
import {
    ReservationService,
    ReservationServiceErr,
    Slot,
    Span,
} from "./reservation.service.js";
import { describe, expect, test } from "@jest/globals";
import { doesNotMatch } from "assert";

function findFirstFreeId(table: any[]): number {
    let cur = 1;
    while (table.find((el) => el.id === cur)) cur++;
    return cur;
}

describe("reservationService module", () => {
    test("findFirstFreeId", () => {
        let r = [{ id: 1 }, { id: 2 }];
        expect(findFirstFreeId(r)).toBe(3);
        r = [{ id: 1 }, { id: 3 }];
        expect(findFirstFreeId(r)).toBe(2);
        r = [{ id: 3 }, { id: 2 }];
        expect(findFirstFreeId(r)).toBe(1);
    });
    test("addSpan", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c++",
            title: "c++",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        expect(r.spans).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                desc: "prog c",
                title: "c",
            },
            {
                id: 2,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                desc: "prog c++",
                title: "c++",
            },
        ]);
    });
    test("addSlot", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "noah.chantin",
        };
        r.addSpan(sp);
        r.addSlot(sl);
        r.addSlot(sl2);
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                idSpan: 1,
                user: "martin.leroy",
            },
            {
                id: 2,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                idSpan: 1,
                user: "noah.chantin",
            },
        ]);
    });
    test("getSpanById found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c++",
            title: "c++",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        expect(r.getSpanById(2)).toStrictEqual({
            id: 2,
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c++",
            title: "c++",
        });
    });
    test("getSpanById not found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c++",
            title: "c++",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        expect(() => r.getSpanById(3)).toThrow(ReservationServiceErr);
    });
    test("getSlotById found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "noah.chantin",
        };
        r.addSpan(sp);
        r.addSlot(sl);
        r.addSlot(sl2);
        expect(r.getSlotById(1)).toStrictEqual({
            id: 1,
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        });
    });
    test("getSlotById not found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "noah.chantin",
        };
        r.addSpan(sp);
        r.addSlot(sl);
        r.addSlot(sl2);
        expect(() => r.getSlotById(3)).toThrow(ReservationServiceErr);
    });
    test("getAllSlotById found", () => {
        let r = new ReservationService();
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 15),
            end: new Date(2024, 3, 18, 12, 30),
            idSpan: 1,
            user: "noah.chantin",
        };
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        r.addSlot(sl);
        r.addSlot(sl2);
        expect(r.getAllSlotBySpanId(1)).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                idSpan: 1,
                user: "martin.leroy",
            },
            {
                id: 2,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                idSpan: 1,
                user: "noah.chantin",
            },
        ]);
    });
    test("getAllSlotById not found", () => {
        let r = new ReservationService();
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 2,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 15),
            end: new Date(2024, 3, 18, 12, 30),
            idSpan: 2,
            user: "noah.chantin",
        };
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        r.addSlot(sl);
        r.addSlot(sl2);
        expect(r.getAllSlotBySpanId(1)).toStrictEqual([]);
    });
    test("deleteSpanById simple found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c++",
            title: "c++",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        r.deleteSpanById(1);
        expect(r.spans).toStrictEqual([
            {
                id: 2,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                desc: "prog c++",
                title: "c++",
            },
        ]);
    });
    test("deleteSpanById simple not found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        r.addSpan(sp);
        expect(() => r.deleteSpanById(2)).toThrow();
    });
    test("deleteSpanById with slots found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c++",
            title: "c++",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 2,
            user: "martin.leroy",
        };
        r.addSpan(sp);
        r.addSpan(sp2);
        r.addSlot(sl);
        r.addSlot(sl2);
        r.deleteSpanById(2);
        expect(r.spans).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                desc: "prog c",
                title: "c",
            },
        ]);
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                idSpan: 1,
                user: "martin.leroy",
            },
        ]);
    });
    test("deleteSlotById found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "noah.chantin",
        };
        r.addSpan(sp);
        r.addSlot(sl);
        r.addSlot(sl2);
        r.deleteSlotById(1);
        expect(r.slots).toStrictEqual([
            {
                id: 2,
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 12, 15),
                idSpan: 1,
                user: "noah.chantin",
            },
        ]);
    });
    test("deleteSlotById not found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "noah.chantin",
        };
        r.addSpan(sp);
        r.addSlot(sl);
        expect(() => r.deleteSlotById(2)).toThrow(ReservationServiceErr);
    });
    test("updateSpanById", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sp2: Span = {
            start: new Date(2024, 3, 18, 12, 15),
            end: new Date(2024, 3, 18, 12, 30),
            desc: "prog c++",
            title: "c++",
        };
        r.addSpan(sp);
        r.updateSpanById(1, sp2);
        expect(r.spans).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                desc: "prog c++",
                title: "c++",
            },
        ]);
    });
    test("updateSlotById found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            desc: "prog c",
            title: "c",
        };
        let sl: Slot = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 12, 15),
            idSpan: 1,
            user: "martin.leroy",
        };
        let sl2: Slot = {
            start: new Date(2024, 3, 18, 12, 15),
            end: new Date(2024, 3, 18, 12, 30),
            idSpan: 1,
            user: "noah.chantin",
        };
        r.addSpan(sp);
        r.addSlot(sl);
        r.updateSlotById(1, sl2);
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                idSpan: 1,
                user: "noah.chantin",
            },
        ]);
    });
    test("makeSlotsFromSpanId span NOT found", () => {
        let r = new ReservationService();
        expect(() =>
            r.makeSlotsFromSpanId({
                span: 1,
                date: new Date(2024, 3, 18, 12, 15),
                inc: 15,
                slot_nb: 1,
            }),
        ).toThrow(ReservationServiceErr);
    });
    test("makeSlotsFromSpanId simple", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 14, 0),
            desc: "prog c",
            title: "c",
        };
        r.addSpan(sp);
        r.makeSlotsFromSpanId({
            span: 1,
            date: new Date(2024, 3, 18, 12, 15),
            inc: 15,
            slot_nb: 1,
        });
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                idSpan: 1,
                user: "",
            },
        ]);
    });
    test("makeSlotsFromSpanId by new span", () => {
        let r = new ReservationService();
        r.makeSlotsFromSpanId({
            span: {
                start: new Date(2024, 3, 18, 12, 0),
                end: new Date(2024, 3, 18, 14, 0),
                desc: "prog c",
                title: "c",
            },
            date: new Date(2024, 3, 18, 12, 15),
            inc: 15,
            slot_nb: 1,
        });
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                idSpan: 1,
                user: "",
            },
        ]);
    });
    test("makeSlotsFromSpanId several with space", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 14, 0),
            desc: "prog c",
            title: "c",
        };
        r.addSpan(sp);
        r.makeSlotsFromSpanId({
            span: 1,
            date: new Date(2024, 3, 18, 12, 15),
            inc: 15,
            slot_nb: 3,
            space: 3,
        });
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                idSpan: 1,
                user: "",
            },
            {
                id: 2,
                start: new Date(2024, 3, 18, 12, 33),
                end: new Date(2024, 3, 18, 12, 48),
                idSpan: 1,
                user: "",
            },
            {
                id: 3,
                start: new Date(2024, 3, 18, 12, 51),
                end: new Date(2024, 3, 18, 13, 6),
                idSpan: 1,
                user: "",
            },
        ]);
    });
    test("addUserToSlotById found", () => {
        let r = new ReservationService();
        let sp: Span = {
            start: new Date(2024, 3, 18, 12, 0),
            end: new Date(2024, 3, 18, 14, 0),
            desc: "prog c",
            title: "c",
        };
        r.addSpan(sp);
        r.makeSlotsFromSpanId({
            span: 1,
            date: new Date(2024, 3, 18, 12, 15),
            inc: 15,
            slot_nb: 1,
        });
        r.addUserToSlotById("martin.leroy", 1);
        expect(r.slots).toStrictEqual([
            {
                id: 1,
                start: new Date(2024, 3, 18, 12, 15),
                end: new Date(2024, 3, 18, 12, 30),
                idSpan: 1,
                user: "martin.leroy",
            },
        ]);
    });
});
