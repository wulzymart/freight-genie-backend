import { FastifyInstance } from "fastify";

export async function staffRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all staff" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create staff" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get staff" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update staff" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete staff" };
  });
}