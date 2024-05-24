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
import * as pa from "./models/params.js";

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
            return { status: error.statusCode, message: valerror.toString() };
        } else if (error instanceof reserv.ReservationServiceErr) {
            return error.Error();
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

    // http POST 127.0.0.1:1234/operations rhs:=2 lhs:=3 kind=ADD
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

    // http GET 127.0.0.1:1234/operations
    web_server.get("/operations", async (req, res) => {
        return res
            .status(201)
            .send({ data: { operations: operations }, message: "success" });
    });

    // http GET 127.0.0.1:1234/operations/ID
    web_server.get<{ Params: { id: string } }>(
        "/operations/:id",
        { schema: { params: z.object({ id: z.string() }) } },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            return res.status(200).send({
                data: { operations: operations[id - 1] },
                message: "Operation Found",
            });
        },
    );

    ///////////////////////////////////////////////////////////////////////////
    // SLOTS OPERATIONS

    // http POST 127.0.0.1:1234/slots start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    web_server.post<{ Body: sl.InputSlot }>(
        "/slots",
        { schema: { body: sl.ZInputSlot } },
        async (req, res) => {
            let data = r.addSlot(req.body);

            return res
                .status(201)
                .send({ data: { slot: data }, message: "Created" });
        },
    );

    // http GET 127.0.0.1:1234/slots/ID
    web_server.get<{ Params: { id: string } }>(
        "/slots/:id",
        { schema: { params: z.object({ id: z.string() }) } },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            return res.status(200).send({
                data: { slots: r.getSlotById(id) },
                message: "Slot Found",
            });
        },
    );

    // http GET 127.0.0.1:1234/slots
    web_server.get("/slots", async (req, res) => {
        return res
            .status(201)
            .send({ data: { slots: r.slots }, message: "success" });
    });

    // http POST 127.0.0.1:1234/slots/ID start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z idSpan:=1
    web_server.put<{ Params: { id: string }; Body: sl.InputSlot }>(
        "/slots/:id",
        {
            schema: {
                params: z.object({ id: z.string() }),
                body: sl.ZInputSlot,
            },
        },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            r.updateSlotById(id, req.body);

            return res.status(201).send({
                data: { slot: r.getSlotById(id) },
                message: "Updated",
            });
        },
    );

    // http DELETE 127.0.0.1:1234/slots/ID
    web_server.delete<{ Params: { id: string } }>(
        "/slots/:id",
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            r.deleteSlotById(id);

            return res.status(200).send({ message: "Slot Deleted" });
        },
    );

    ///////////////////////////////////////////////////////////////////////////
    // SPANS OPERATIONS

    // http POST 127.0.0.1:1234/spans start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C title=CC
    web_server.post<{ Body: sp.InputSpan }>(
        "/spans",
        { schema: { body: sp.ZInputSpan } },
        async (req, res) => {
            let data = r.addSpan(req.body);

            return res
                .status(201)
                .send({ data: { span: data }, message: "Created" });
        },
    );

    // http GET 127.0.0.1:1234/spans/ID
    web_server.get<{ Params: { id: string } }>(
        "/spans/:id",
        { schema: { params: z.object({ id: z.string() }) } },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            return res.status(200).send({
                data: { span: r.getSpanById(id) },
                message: "Span Found",
            });
        },
    );

    // http GET 127.0.0.1:1234/spans
    web_server.get("/spans", async (req, res) => {
        return res
            .status(201)
            .send({ data: { spans: r.spans }, message: "success" });
    });

    // http POST 127.0.0.1:1234/spans/ID start=2024-05-23T19:00:00.000Z end=2024-05-23T19:30:00.000Z desc=C title=CC
    web_server.put<{ Params: { id: string }; Body: sp.InputSpan }>(
        "/spans/:id",
        {
            schema: {
                params: z.object({ id: z.string() }),
                body: sp.ZInputSpan,
            },
        },
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            r.updateSpanById(id, req.body);

            return res.status(201).send({
                data: { span: r.getSpanById(id) },
                message: "Updated",
            });
        },
    );

    // http DELETE 127.0.0.1:1234/spans/ID
    web_server.delete<{ Params: { id: string } }>(
        "/spans/:id",
        async (req, res) => {
            let id: number = parseInt(req.params.id);

            if (isNaN(id) || id < 1)
                return res.status(404).send({ error: "Invalid id" });

            r.deleteSpanById(id);

            return res.status(200).send({ message: "Span deleted" });
        },
    );

    // http POST 127.0.0.1:1234/spans/gen_slots date=2024-05-23T19:00:00.000Z inc:=15 slot_nb:=2 span:='{"start": "2024-05-23T19:00:00.000Z", "end": "2024-05-23T19:45:00.000Z", "desc": "C", "title": "CCC"}'
    web_server.post<{ Body: pa.Params }>(
        "/spans/gen_slots",
        { schema: { body: pa.ZParams } },
        async (req, res) => {
            let id = r.makeSlotsFromSpanId(req.body);

            return res.status(201).send({
                data: { span: r.getSpanById(id) },
                message: "Slots Generated",
            });
        },
    );

    web_server.listen({ port: 1234, host: "0.0.0.0" }, (err, address) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`listening on ${address}`);
        }
    });
}
