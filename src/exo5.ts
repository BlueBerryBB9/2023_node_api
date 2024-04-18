import { mk_dates_every_minutes as mk_date } from "./exo4.js";

export type TimeSlot = {
    bgn_date: Date;
    end_date: Date;
    login?: string;
};

export function mk_date_inc(date: Date, min: number) {
    let new_date = new Date(date);
    new_date.setMinutes(new_date.getMinutes() + min);
    return new_date;
}

export function mk_slots(params: {
    date: Date;
    inc: number;
    slot_nb: number;
    space?: number;
    pause_rate?: number;
    pause_time?: number;
}) {
    let mod = 0;
    let slots_array: TimeSlot[] = [];
    let new_date: Date = new Date(params.date);
    if (params.space === undefined) params.space = 0;
    if (params.pause_rate === undefined) params.pause_rate = 0;
    if (params.pause_time === undefined) params.pause_time = 0;
    for (let i = 0; i < params.slot_nb; i++) {
        if (i % params.pause_rate === 0 && i !== 0) mod = params.pause_time;
        else if (params.space > 0 && i !== 0) mod = params.space;
        new_date = mk_date_inc(new_date, params.inc + mod);
        slots_array.push({
            bgn_date: mk_date_inc(new_date, -params.inc),
            end_date: new_date,
        });
    }
    return slots_array;
}
