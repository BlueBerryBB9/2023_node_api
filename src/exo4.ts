export function mk_dates_every_minutes(params: {
    date: Date;
    inc: number;
    date_nb: number;
}) {
    let date_array: Date[] = [];
    let i = 0;

    date_array.push(params.date);

    let new_date = params.date;

    while (i < params.date_nb) {
        new_date = new Date(new_date);
        new_date.setMinutes(new_date.getMinutes() + params.inc);
        date_array.push(new_date);
        i++;
    }

    return date_array;
}
