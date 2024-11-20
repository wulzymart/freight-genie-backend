import { FastifyInstance } from "fastify";

export async function expensesRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all expenses" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create expense" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get expense" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update expense" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete expense" };
  });
}
