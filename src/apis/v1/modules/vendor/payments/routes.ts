import { FastifyInstance } from "fastify";

export async function paymentsRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all payments" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create payment" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get payment" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update payment" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete payment" };
  });
}
