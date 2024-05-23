import * as reserv from "../reservation.service.js";
import z from "zod";

export const ZSlot = z.object({
    id: z.number(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    user: z.string().optional(),
    idSpan: z.number(),
});

export const ZPartialSlot = ZSlot.partial(); // tous les champs sont devenus optionels
export const ZInputSlot = ZSlot.omit({ id: true }); // le même objet sans l'id

export type Slot = z.infer<typeof ZSlot>; // Le type typescript qui correspond à l'objet
export type PartialSlot = z.infer<typeof ZPartialSlot>; // Le type typescript avec toutes les props optionelles
export type InputSlot = z.infer<typeof ZInputSlot>; // Le type typescript sans l'id
