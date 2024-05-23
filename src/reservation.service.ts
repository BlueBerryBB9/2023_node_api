function mk_date_inc(date: Date, min: number) {
    let new_date = new Date(date);
    new_date.setMinutes(new_date.getMinutes() + min);
    return new_date;
}

export type Slot = {
    id?: number;
    start: Date;
    end: Date;
    user?: string;
    idSpan: number;
};

export type Span = {
    id?: number;
    start: Date;
    end: Date;
    desc: string;
    title: string;
};

export interface IReservationService {
    spans: Span[];
    slots: Slot[];

    addSpan(span: Span): Span;
    addSlot(slot: Slot): Slot;
    getSpanById(id: number): Span;
    getSlotById(id: number): Slot;
    getAllSlotBySpanId(id: number): Slot[];
    deleteSpanById(id: number): void;
    deleteSlotById(id: number): void;
    updateSpanById(id: number, maj: Span): void;
    updateSlotById(id: number, maj: Slot): void;
    makeSlotsFromSpanId(prms: {
        span: Span | number;
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
    spans: Span[] = [];
    slots: Slot[] = [];

    makeSlotsFromSpanId(prms: {
        span: Span | number;
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
            this.addSpan(prms.span);
            if (prms.span.id) idSpan = prms.span.id;
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
                idSpan: idSpan,
            });

            if (i % prms.pause_rate === 0) mod = prms.pause_time;
            else mod = prms.space;
        }
    }

    addUserToSlotById(login: string, slotId: number): void {
        let slot: Slot | undefined = this.slots.find((el) => el.id === slotId);
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

    checkDatesIncoherence(s: Span | Slot) {
        let msg: "Slot" | "Span" = "idSpan" in s ? "Slot" : "Span";
        if (s.start >= s.end)
            throw new ReservationServiceErr(msg, "DatesIncoherent");
    }

    addSpan(span: Span): Span {
        span.id = this.findFirstFreeId(this.spans);
        this.checkDatesIncoherence(span);
        this.spans.push(span);
        return span;
    }

    checkIfSlotDatesInSpanDates(slot: Slot): void {
        let span: Span | undefined = this.spans.find(
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

    checkIfSlotDatesBusyInSpan(slot: Slot) {
        let span: Span | undefined = this.spans.find(
            (el) => el.id === slot.idSpan,
        );
        if (!span) throw new ReservationServiceErr("Span", "NotFound");
        const slots = this.getAllSlotBySpanId(slot.idSpan);
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

    getAllSlotsByLogin(login: string): Slot[] {
        return this.slots.filter((el) => el.user === login);
    }

    checkIfUserBusy(slot: Slot, login: string) {
        const slots: Slot[] = this.getAllSlotsByLogin(login);
        slots.forEach((el) => {
            if (
                (slot.start >= el.start && slot.start < el.end) ||
                (slot.end > el.start && slot.end <= el.end)
            )
                throw new ReservationServiceErr("User", "Busy");
        });
    }

    addSlot(slot: Slot): Slot {
        if (!this.spans.find((el) => el.id === slot.idSpan))
            throw new ReservationServiceErr("Span", "NotFound");
        this.checkDatesIncoherence(slot);
        this.checkIfSlotDatesInSpanDates(slot);
        this.checkIfSlotDatesBusyInSpan(slot);
        if (slot.user) {
            this.checkIfUserAlreadyInSpan(slot.user, slot.idSpan);
            this.checkIfUserBusy(slot, slot.user);
        }
        slot.id = this.findFirstFreeId(this.slots);
        this.slots.push(slot);
        return slot;
    }

    getSpanById(id: number): Span {
        let rtrn = this.spans.find((el) => el.id === id);
        if (!rtrn) throw new ReservationServiceErr("Span", "NotFound");
        return rtrn;
    }

    getSlotById(id: number): Slot {
        let rtrn = this.slots.find((el) => el.id === id);
        if (!rtrn) throw new ReservationServiceErr("Slot", "NotFound");
        return rtrn;
    }

    getAllSlotBySpanId(id: number): Slot[] {
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

    updateSpanById(id: number, maj: Span): void {
        let span = this.spans.find((el) => el.id === id);
        if (!span) throw new ReservationServiceErr("Span", "NotFound");

        if (maj.start != span?.start || maj.end != span?.end)
            this.checkDatesIncoherence(maj);

        maj.id = id;
        this.spans[this.spans.findIndex((el) => el.id === id)] = maj;
    }

    updateSlotById(id: number, maj: Slot): void {
        let slot = this.slots.find((el) => el.id === id);
        if (!slot) throw new ReservationServiceErr("Slot", "NotFound");

        maj.id = id;
        if (maj.idSpan !== slot.idSpan)
            throw new ReservationServiceErr("Slot", "ProhibitedIdSpanChange");

        if (maj.start !== slot?.start || maj.end !== slot?.end) {
            this.checkDatesIncoherence(maj);
            this.checkIfSlotDatesInSpanDates(maj);
            this.checkIfSlotDatesBusyInSpan(maj);
        }

        if (maj.user !== slot.user) {
            if (maj.user) {
                this.checkIfUserAlreadyInSpan(maj.user, maj.idSpan);
                this.checkIfUserBusy(slot, maj.user);
            }
        }

        this.slots[this.slots.findIndex((el) => el.id === id)] = maj;
    }
}

export class ReservationServiceErr {
    constructor(
        subject: "Span" | "Slot" | "User",
        msg:
            | "NotFound"
            | "Overlapping"
            | "DatesIncoherent"
            | "DatesOutofSpan"
            | "AlreadyInSpan"
            | "Busy"
            | "ProhibitedIdSpanChange",
    ) {
        console.log(subject + " : " + msg);
    }
}
