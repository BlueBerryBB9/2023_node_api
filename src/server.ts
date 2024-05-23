import Fastify, * as ff from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fromError } from "zod-validation-error";
import { z } from "zod";
import * as reserv from "./reservation.service.js";
import * as sp from "./models/span.js";
import * as sl from "./models/slot.js";

export function start_web_server() {
    let web_server = Fastify({
        logger: true,
    }).withTypeProvider<ZodTypeProvider>();
    web_server.setValidatorCompiler(validatorCompiler);
    web_server.setSerializerCompiler(serializerCompiler);
    web_server.setErrorHandler(async function (error, _, reply) {
        if (error instanceof z.ZodError) {
            const valerror = fromError(error);
            reply.code(error.statusCode || 400);
            return { message: valerror.toString() };
        } else {
            reply.status(500);
            console.error(error);
            return { message: "i don't know what to do with this error" };
        }
    });

    let r: reserv.ReservationService = new reserv.ReservationService();

    web_server.get("/", async () => {
        return { message: "hello world" };
    });

    type Operation = {
        kind: "ADD" | "SUB" | "MUL" | "DIV" | "MOD";
        rhs: number;
        lhs: number;
        res: number;
    };

    const ZOperation = z.object({
        kind: z
            .literal("ADD")
            .or(z.literal("SUB"))
            .or(z.literal("MUL"))
            .or(z.literal("DIV"))
            .or(z.literal("MOD")),
        rhs: z.number(),
        lhs: z.number(),
        res: z.number(),
    });

    const operations: Operation[] = [];

    web_server.post<{
        Body: Omit<Operation, "res">;
    }>(
        "/operations",
        { schema: { body: ZOperation.omit({ res: true }) } },
        async (req, res) => {
            const { kind, rhs, lhs } = req.body;
            let result: number;

            if (kind === "ADD") {
                result = lhs + rhs;
            } else if (kind === "SUB") {
                result = lhs - rhs;
            } else if (kind === "MUL") {
                result = lhs * rhs;
            } else if (kind === "DIV") {
                result = lhs / rhs;
            } else if (kind === "MOD") {
                result = lhs % rhs;
            } else {
                return res.status(400).send({ error: "Invalid" });
            }
            const id = operations.push({ kind, rhs, lhs, res: result });

            return res.status(201).send({ id, message: "created" });
        },
    );

    web_server.get("/operations", async (req, res) => {
        return res.status(201).send({ data: operations, message: "success" });
    });

    web_server.get<{ Params: { id: string } }>(
        "/operations/:id",
        { schema: { params: z.object({ id: z.string() }) } },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1 || id > operations.length)
                return res.status(404).send({ error: "Invalid id" });

            return res.status(200).send(operations[id - 1]);
        },
    );

    web_server.post<{ Body: sl.InputSlot }>(
        "/slots",
        { schema: { body: sl.ZInputSlot } },
        async (req, res) => {
            r.addSlot(req.body);

            return res.status(201).send({ message: "Created" });
        },
    );

    web_server.get<{ Params: { id: string } }>(
        "/slots/:id",
        { schema: { params: z.object({ id: z.string() }) } },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1 || id > operations.length)
                return res.status(404).send({ error: "Invalid id" });

            return res.status(200).send(r.getSlotById(id));
        },
    );

    // web_server.get<{}>("/slots/list", {}, async (req, re) => {});

    // web_server.post<{}>("/slots/edit/:id", {}, async (req, re) => {});

    // web_server.post<{}>("/slots/delete/:id", {}, async (req, re) => {});

    ///////////////////////////////////////////////////////////////////////////

    web_server.post<{ Body: sp.InputSpan }>(
        "/spans",
        { schema: { body: sp.ZInputSpan } },
        async (req, res) => {
            r.addSpan(req.body);

            return res.status(201).send({ message: "Created" });
        },
    );

    web_server.get<{ Params: { id: string } }>(
        "/span/:id",
        { schema: { params: z.object({ id: z.string() }) } },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1 || id > operations.length)
                return res.status(404).send({ error: "Invalid id" });

            return res.status(200).send(r.getSpanById(id));
        },
    );

    // web_server.get<{}>("/spans/list", {}, async (req, re) => {});

    // web_server.post<{}>("/spans/edit/:id", {}, async (req, re) => {});

    // web_server.post<{}>("/spans/delete/:id", {}, async (req, re) => {});

    web_server.listen({ port: 1234, host: "0.0.0.0" }, (err, address) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`listening on ${address}`);
        }
    });
}
