import {FastifyInstance} from "fastify";
import {addStation, getStation, getStations} from "./controller.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";

export async function stationsRoutes(fastify: FastifyInstance) {
    fastify.get("/", getStations);
    fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, addStation as any);
    fastify.put("/station", getStation);
    fastify.delete("/:id", async function (request, reply) {
        return {mssg: "delete station"};
    });
}
