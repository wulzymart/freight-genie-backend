import { FastifyInstance } from "fastify";

export async function chargesRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all charges" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create charge" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get charge" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update charge" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete charge" };
  });
}
