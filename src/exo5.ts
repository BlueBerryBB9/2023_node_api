import { mk_dates_every_minutes } from "./exo4.js";

export type TimeSlot = {
    bgn_date: Date;
    end_date: Date;
    login?: string;
};

export function mk_slots(params: { date: Date; inc: number; slot_nb: number }) {
    let i = 0;
    let slots_array: TimeSlot[] = [];
    let new_date: Date = new Date(params.date);
    new_date.setMinutes(new_date.getMinutes() + params.inc);
    let dates: Date[] = [params.date, new_date];

    while (i < params.slot_nb) {
        slots_array.push({ bgn_date: dates[0], end_date: dates[1] });
        dates = mk_dates_every_minutes({
            date: new Date(dates[1]),
            inc: params.inc,
            date_nb: 1,
        });
        i++;
    }

    return slots_array;
}
