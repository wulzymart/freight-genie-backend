import { FastifyInstance } from "fastify";

export async function vehiclesRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all vehicles" };
  });
  fastify.post("/", async function (request, reply) {
    return { mssg: "create vehicle" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get vehicle" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update vehicle" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete vehicle" };
  });
}
