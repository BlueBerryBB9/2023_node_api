import * as sl from "./models/slot.js";
import * as sp from "./models/span.js";

function mk_date_inc(date: Date, min: number) {
    let new_date = new Date(date);
    new_date.setMinutes(new_date.getMinutes() + min);
    return new_date;
}

export interface IReservationService {
    spans: sp.Span[];
    slots: sl.Slot[];

    addSlot(slot: sl.InputSlot): sl.Slot;
    addSpan(span: sp.InputSpan): sp.Span;
    getSlotById(id: number): sl.Slot;
    getSpanById(id: number): sp.Span;
    getAllSlotBySpanId(id: number): sl.Slot[];
    deleteSlotById(id: number): void;
    deleteSpanById(id: number): void;
    updateSlotById(id: number, maj: sl.InputSlot): void;
    updateSpanById(id: number, maj: sp.InputSpan): void;
    makeSlotsFromSpanId(prms: {
        span: sp.InputSpan | number;
        date: Date;
        inc: number;
        slot_nb: number;
        space?: number;
        pause_rate?: number;
        pause_time?: number;
    }): void;
    addUserToSlotById(login: string, slotId: number): void;
}

export class ReservationService implements IReservationService {
    spans: sp.Span[] = [];
    slots: sl.Slot[] = [];

    makeSlotsFromSpanId(prms: {
        span: sp.InputSpan | number;
        date: Date;
        inc: number;
        slot_nb: number;
        space?: number;
        pause_rate?: number;
        pause_time?: number;
    }): void {
        let mod = 0;
        let idSpan: number = 0;
        let new_date: Date = new Date(prms.date);

        if (typeof prms.span === "object") {
            let n_span = this.addSpan(prms.span);
            idSpan = n_span.id;
        } else if (!this.spans.find((el) => el.id === prms.span))
            throw new ReservationServiceErr("Span", "NotFound");
        else idSpan = prms.span;

        if (!prms.space) prms.space = 0;
        if (!prms.pause_rate) prms.pause_rate = 0;
        if (!prms.pause_time) prms.pause_time = 0;

        for (let i = 1; i <= prms.slot_nb; i++) {
            new_date = mk_date_inc(new_date, prms.inc + mod);

            this.addSlot({
                start: mk_date_inc(new_date, -prms.inc),
                end: new_date,
                idSpan,
            });

            if (i % prms.pause_rate === 0) mod = prms.pause_time;
            else mod = prms.space;
        }
    }

    addUserToSlotById(login: string, slotId: number): void {
        let slot: sl.Slot | undefined = this.slots.find(
            (el) => el.id === slotId,
        );
        if (!slot) throw new ReservationServiceErr("Slot", "NotFound");

        this.checkIfUserAlreadyInSpan(login, slot.idSpan);
        this.checkIfUserBusy(slot, login);
        this.slots[this.slots.findIndex((el) => el.id === slotId)].user = login;
    }

    findFirstFreeId(table: any[]): number {
        let cur = 1;
        while (table.find((el) => el.id === cur)) cur++;
        return cur;
    }

    checkDatesIncoherence(s: sp.Span | sl.Slot) {
        let msg: "Slot" | "Span" = "idSpan" in s ? "Slot" : "Span";
        if (s.start >= s.end)
            throw new ReservationServiceErr(msg, "DatesIncoherent");
    }

    addSpan(span: sp.InputSpan): sp.Span {
        let id = this.findFirstFreeId(this.spans);
        let sp: sp.Span = { ...span, id };

        this.checkDatesIncoherence(sp);
        this.spans.push(sp);
        return sp;
    }

    checkIfSlotDatesInSpanDates(slot: sl.Slot): void {
        let span: sp.Span | undefined = this.spans.find(
            (el) => el.id === slot.idSpan,
        );
        if (!span) throw new ReservationServiceErr("Span", "NotFound");
        if (
            slot.start < span.start ||
            slot.start > span.end ||
            slot.end < span.start ||
            slot.end > span.end
        )
            throw new ReservationServiceErr("Slot", "DatesOutofSpan");
    }

    checkIfSlotDatesBusyInSpan(slot: sl.Slot) {
        let span: sp.Span | undefined = this.spans.find(
            (el) => el.id === slot.idSpan,
        );
        if (!span) throw new ReservationServiceErr("Span", "NotFound");
        let slots = this.getAllSlotBySpanId(slot.idSpan);
        slots = slots.filter((el) => el.id !== slot.id);
        slots.forEach((el) => {
            if (
                (slot.start >= el.start && slot.start < el.end) ||
                (slot.end > el.start && slot.end <= el.end)
            )
                throw new ReservationServiceErr("Slot", "Overlapping");
        });
    }

    checkIfUserAlreadyInSpan(login: string, idSpan: number) {
        const slots = this.getAllSlotBySpanId(idSpan);
        slots.forEach((el) => {
            if (login === el.user)
                throw new ReservationServiceErr("User", "AlreadyInSpan");
        });
    }

    getAllSlotsByLogin(login: string): sl.Slot[] {
        return this.slots.filter((el) => el.user === login);
    }

    checkIfUserBusy(slot: sl.Slot, login: string) {
        let slots: sl.Slot[] = this.getAllSlotsByLogin(login);
        slots = slots.filter((el) => el.id !== slot.id);
        slots.forEach((el) => {
            if (
                (slot.start >= el.start && slot.start < el.end) ||
                (slot.end > el.start && slot.end <= el.end)
            )
                throw new ReservationServiceErr("User", "Busy");
        });
    }

    addSlot(slot: sl.InputSlot): sl.Slot {
        let id = this.findFirstFreeId(this.slots);
        let sl: sl.Slot = { ...slot, id };

        if (!this.spans.find((el) => el.id === slot.idSpan))
            throw new ReservationServiceErr("Span", "NotFound");

        this.checkDatesIncoherence(sl);
        this.checkIfSlotDatesInSpanDates(sl);
        this.checkIfSlotDatesBusyInSpan(sl);

        if (sl.user) {
            this.checkIfUserAlreadyInSpan(sl.user, slot.idSpan);
            this.checkIfUserBusy(sl, sl.user);
        }
        this.slots.push(sl);
        return sl;
    }

    getSpanById(id: number): sp.Span {
        let rtrn = this.spans.find((el) => el.id === id);
        if (!rtrn) throw new ReservationServiceErr("Span", "NotFound");
        return rtrn;
    }

    getSlotById(id: number): sl.Slot {
        let rtrn = this.slots.find((el) => el.id === id);
        if (!rtrn) throw new ReservationServiceErr("Slot", "NotFound");
        return rtrn;
    }

    getAllSlotBySpanId(id: number): sl.Slot[] {
        return this.slots.filter((el) => el.idSpan === id);
    }

    deleteSpanById(id: number): void {
        if (!this.spans.find((el) => el.id === id))
            throw new ReservationServiceErr("Span", "NotFound");
        this.spans = this.spans.filter((el) => el.id !== id);
        this.slots = this.slots.filter((el) => el.idSpan !== id);
    }

    deleteSlotById(id: number): void {
        if (!this.slots.find((el) => el.id === id))
            throw new ReservationServiceErr("Slot", "NotFound");
        this.slots = this.slots.filter((el) => el.id !== id);
    }

    checkIfSpanCanContainsSlots(s: sp.Span) {
        let slots: sl.Slot[] = this.getAllSlotBySpanId(s.id);
        if (slots.length === 0) return;
        let maxDate: Date = this.slots[0].end;
        let minDate: Date = this.slots[0].start;

        slots.forEach((el) => {
            if (maxDate < el.end) maxDate = el.end;
            if (minDate > el.start) minDate = el.start;
        });
        if (maxDate > s.end)
            throw new ReservationServiceErr("Span", "NotEnoughSpace");
        if (minDate < s.start)
            throw new ReservationServiceErr("Span", "NotEnoughSpace");
    }

    updateSpanById(id: number, maj: sp.InputSpan): void {
        let span = this.spans.find((el) => el.id === id);
        if (!span) throw new ReservationServiceErr("Span", "NotFound");

        let sp: sp.Span = { ...maj, id };
        if (sp.start != span.start || sp.end != span.end) {
            this.checkDatesIncoherence(sp);
            this.checkIfSpanCanContainsSlots(sp);
        }

        sp.id = id;
        this.spans[this.spans.findIndex((el) => el.id === id)] = sp;
    }

    updateSlotById(id: number, maj: sl.InputSlot): void {
        let slot = this.slots.find((el) => el.id === id);
        if (!slot) throw new ReservationServiceErr("Slot", "NotFound");

        let spanIdChanged: boolean = false;
        let sl: sl.Slot = { ...maj, id };
        if (sl.idSpan !== slot.idSpan) {
            if (!this.spans.find((el) => el.id === id))
                throw new ReservationServiceErr("Span", "NotFound");
            spanIdChanged = true;
        }

        if (sl.start !== slot.start || sl.end !== slot.end || spanIdChanged) {
            this.checkDatesIncoherence(sl);
            this.checkIfSlotDatesInSpanDates(sl);
            this.checkIfSlotDatesBusyInSpan(sl);
        }

        if (sl.user !== slot.user || spanIdChanged) {
            if (sl.user) {
                this.checkIfUserAlreadyInSpan(sl.user, sl.idSpan);
                this.checkIfUserBusy(sl, sl.user);
            }
        }

        this.slots[this.slots.findIndex((el) => el.id === id)] = sl;
    }
}

export class ReservationServiceErr extends Error {
    statusCode: number;
    message: string;
    constructor(
        subject: "Span" | "Slot" | "User",
        msg:
            | "NotFound"
            | "Overlapping"
            | "DatesIncoherent"
            | "DatesOutofSpan"
            | "AlreadyInSpan"
            | "Busy"
            | "ProhibitedIdSpanChange"
            | "NotEnoughSpace",
        statusCode?: number,
    ) {
        super(subject + " : " + msg);
        this.message = subject + " : " + msg;
        this.statusCode = statusCode ? statusCode : 500;
    }
    Error() {
        return {
            message: this.message,
            status: this.statusCode,
        };
    }
}
