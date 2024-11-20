import { FastifyInstance } from "fastify";
import { State } from "../../../../../db/entities/vendor/states.entity.js";

export async function locationsRoutes(fastify: FastifyInstance) {
  fastify.get("/states", async function (request, reply) {
    const states = await request.vendorDataSource?.getRepository(State).find();
    return { mssg: "all states", states };
  });
}
