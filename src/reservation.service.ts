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
    getSpanById(id: number): Span | undefined;
    getSlotById(id: number): Slot | undefined;
    getAllSlotBySpanId(id: number): Slot[] | undefined;
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
    getSpanById(id: number): Span | undefined {
        return this.spans.find((el) => el.id === id);
    }
    getSlotById(id: number): Slot | undefined {
        return this.slots.find((el) => el.id === id);
    }
    getAllSlotBySpanId(id: number): Slot[] | undefined {
        return this.slots.filter((el) => el.id === id);
    }
    deleteSpanById(id: number): void {
        this.spans = this.spans.filter((el) => el.id !== id);
        this.slots = this.slots.filter((el) => el.idSpan !== id);
    }
    deleteSlotById(id: number): void {
        this.slots = this.slots.filter((el) => el.id !== id);
    }
    updateSpanById(id: number, maj: Span): void {
        maj.id = id;
        let span = this.spans.find((el) => el.id === maj.id);
        span = maj;
    }
    updateSlotById(id: number, maj: Slot): void {
        maj.id = id;
        let slot = this.slots.find((el) => el.id === maj.id);
        slot = maj;
    }
}
