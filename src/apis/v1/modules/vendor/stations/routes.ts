import { FastifyInstance } from "fastify";
import { addStation, getStation, getStations } from "./controller.js";

export async function stationsRoutes(fastify: FastifyInstance) {
  fastify.get("/", getStations);
  fastify.post("/", addStation);
  fastify.put("/station", getStation);
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete station" };
  });
}
