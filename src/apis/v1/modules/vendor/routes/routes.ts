import { FastifyInstance } from "fastify";
import { addRoute, getRoute, getRoutes } from "./controllers.js";

export async function routesRoutes(fastify: FastifyInstance) {
  fastify.get("/", getRoutes);
  fastify.post("/", addRoute);
  fastify.get("/:id", getRoute);
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update route" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete route" };
  });
}
