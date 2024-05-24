import * as reserv from "../reservation.service.js";
import * as sl from "./slot.js";
import * as sp from "./span.js";
import z from "zod";

export const ZParams = z.object({
    span: sp.ZInputSpan.or(z.number()),
    date: z.coerce.date(),
    inc: z.number(),
    slot_nb: z.number(),
    space: z.number().optional(),
    pause_rate: z.number().optional(),
    pause_time: z.number().optional(),
});

export const ZPartialParams = ZParams.partial(); // tous les champs sont devenus optionels

export type Params = z.infer<typeof ZParams>; // Le type typescript qui correspond à l'objet
export type PartialParams = z.infer<typeof ZPartialParams>; // Le type typescript avec toutes les props optionelles
