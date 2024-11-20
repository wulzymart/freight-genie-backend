import { FastifyInstance } from "fastify";

export async function expenseTypesRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all expense types" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create expense type" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get expense type" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update expense type" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete expense type" };
  });
}
