function mk_date_inc(date: Date, min: number) {
    let new_date = new Date(date);
    new_date.setMinutes(new_date.getMinutes() + min);
    return new_date;
}

export type Slot = {
    id?: number;
    start: Date;
    end: Date;
    user: string;
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
}

export class ReservationService implements IReservationService {
    spans: Span[] = [];
    slots: Slot[] = [];

    // A FINIR / NOT WORKING
    makeSlotsFromSpanId(prms: {
        span: Span | number;
        date: Date;
        inc: number;
        slot_nb: number;
        space?: number;
        pause_rate?: number;
        pause_time?: number;
    }) {
        let mod = 0;
        let idSpan: number = 0;
        let new_date: Date = new Date(prms.date);

        if (typeof prms.span === "object") {
            this.addSpan(prms.span);
            console.log(prms.span);
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
                user: "",
            });

            if (i % prms.pause_rate === 0) mod = prms.pause_time;
            else mod = prms.space;
        }
        return this.slots;
    }

    findFirstFreeId(table: any[]): number {
        let cur = 1;
        while (table.find((el) => el.id === cur)) cur++;
        return cur;
    }

    addSpan(span: Span): Span {
        span.id = this.findFirstFreeId(this.spans);
        this.spans.push(span);
        return span;
    }

    IsSpanTimeAlreadyBusy(slot: Slot): void {
        if (
            this.slots.find((el) => {
                if (el.idSpan === slot.idSpan) {
                    return (
                        el.start < slot.start &&
                        slot.start < el.end &&
                        el.start < slot.end &&
                        slot.end < el.end
                    );
                }
                return false;
            })
        )
            throw new ReservationServiceErr("Slot", "Overlapping");
    }

    addSlot(slot: Slot): Slot {
        if (!this.spans.find((el) => el.id === slot.idSpan))
            throw new ReservationServiceErr("Span", "NotFound");
        this.IsSpanTimeAlreadyBusy(slot);
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
        if (!this.spans.find((el) => el.id === id))
            throw new ReservationServiceErr("Span", "NotFound");
        maj.id = id;
        this.spans[this.spans.findIndex((el) => el.id === id)] = maj;
    }

    updateSlotById(id: number, maj: Slot): void {
        if (!this.slots.find((el) => el.id === id))
            throw new ReservationServiceErr("Slot", "NotFound");
        maj.id = id;
        this.slots[this.slots.findIndex((el) => el.id === id)] = maj;
    }
}

export class ReservationServiceErr {
    constructor(
        subject: "Span" | "Slot",
        msg: "NotFound" | "AlreadyExist" | "Overlapping",
    ) {
        console.log(subject + " : " + msg);
    }
}
