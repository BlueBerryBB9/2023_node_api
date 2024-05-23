import Fastify, * as ff from "fastify";
let web_server = Fastify({ logger: true });

web_server.get("/", async () => {
    return { message: "hello world" };
});

type Operation = {
    kind: "ADD" | "SUB" | "MUL" | "DIV" | "MOD";
    rhs: number;
    lhs: number;
    res: number;
};

const operations: number[] = [];
web_server.post<{
    Body: {
        kind: "ADD" | "SUB" | "MUL" | "DIV" | "MOD";
        rhs: number;
        lhs: number;
    };
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
    const id = operations.push(result);

    return res.status(201).send({ id, message: "created" });
});

web_server.listen({ port: 1234, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`listening on ${address}`);
    }
});
