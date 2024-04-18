import { mk_dates_every_minutes as mk_date } from "./exo4.js";

export type TimeSlot = {
    bgn_date: Date;
    end_date: Date;
    login?: string;
};

export function mk_slots(params: {
    date: Date;
    inc: number;
    slot_nb: number;
    space?: number;
    pause_rate?: number;
    pause_time?: number;
}) {
    let slots_array: TimeSlot[] = [];
    let new_date: Date = new Date(params.date);
    new_date.setMinutes(new_date.getMinutes() + params.inc);
    let dates: Date[] = [params.date, new_date];

    if (params.space === undefined) params.space = 0;
    if (params.pause_rate === undefined) params.pause_rate = 0;
    if (params.pause_time === undefined) params.pause_time = 0;

    for (let i = 1; i <= params.slot_nb; i++) {
        slots_array.push({ bgn_date: dates[0], end_date: dates[1] });
        dates = mk_date({
            date: new Date(dates[1]),
            inc:
                (i % params.pause_rate === 0 && i != 0
                    ? params.pause_time
                    : 0) || (params.space !== 0 ? params.space : 0),
            date_nb: 1,
        });
        dates = mk_date({
            date: new Date(dates[1]),
            inc: params.inc,
            date_nb: 1,
        });
    }
    return slots_array;
}
