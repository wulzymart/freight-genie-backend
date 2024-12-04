import {FastifyInstance} from "fastify";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";
import {createTrip, deleteTrip, editTrip, getAllTrips, getTripById, updateTripRouting} from "./controllers.js";

export async function tripsRoutes(fastify: FastifyInstance) {
    fastify.get("/", getAllTrips);
    fastify.post("/", {onRequest: authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.REGION_MANAGER, StaffRole.MANAGER])}, createTrip as any);
    fastify.get("/:id", getTripById);
    fastify.get("/:id/update-trip", updateTripRouting);
    fastify.put("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.REGION_MANAGER, StaffRole.MANAGER])]}, editTrip as any);
    fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.REGION_MANAGER, StaffRole.REGION_MANAGER])]}, deleteTrip as any);
}
