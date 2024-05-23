import Fastify, * as ff from "fastify";
let web_server = Fastify({ logger: true });

export function start_web_server() {
    web_server.get("/", async () => {
        return { message: "hello world" };
    });

    type Operation = {
        kind: "ADD" | "SUB" | "MUL" | "DIV" | "MOD";
        rhs: number;
        lhs: number;
        res: number;
    };

    const operations: Operation[] = [];

    web_server.post<{
        Body: Omit<Operation, "res">;
    }>("/operations", async (req, res) => {
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
    });

    web_server.get("/operations", async (req, res) => {
        return res.status(201).send({ data: operations, message: "success" });
    });

    web_server.get<{ Params: { id: number } }>(
        "/operations/:id",
        async (req, res) => {
            let id: number = req.params.id;

            if (isNaN(id) || id < 1 || id > operations.length) {
                return res.status(404).send({ error: "Invalid id" });
            }

            return res.status(200).send(operations[id - 1]);
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
