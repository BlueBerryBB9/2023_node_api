import * as reserv from "../reservation.service.js";
import z from "zod";

export const ZSpan = z.object({
    id: z.number(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    desc: z.string(),
    title: z.string(),
});

export const ZPartialSpan = ZSpan.partial(); // tous les champs sont devenus optionels
export const ZInputSpan = ZSpan.omit({ id: true }); // le même objet sans l'id

export type Span = z.infer<typeof ZSpan>; // Le type typescript qui correspond à l'objet
export type PartialSpan = z.infer<typeof ZPartialSpan>; // Le type typescript avec toutes les props optionelles
export type InputSpan = z.infer<typeof ZInputSpan>; // Le type typescript sans l'id
