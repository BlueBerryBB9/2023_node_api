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
}

export class ReservationService implements IReservationService {
    spans: Span[] = [];
    slots: Slot[] = [];

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
    addSlot(slot: Slot): Slot {
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
    constructor(subject: "Span" | "Slot", msg: "NotFound") {
        console.log(subject + " : " + msg);
    }
}
