import { FastifyInstance } from "fastify";

export async function tripsRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all trips" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create trip" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get trip" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update trip" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete trip" };
  });
}
