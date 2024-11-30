import {FastifyInstance} from "fastify";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";
import {createShipment, deleteShipment, editShipment, getAllShipments, getShipmentById} from "./controllers.js";

export async function shipmentsRoutes(fastify: FastifyInstance) {
    fastify.get("/", getAllShipments);
    fastify.post("/", {onRequest: authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.REGION_MANAGER, StaffRole.MANAGER])}, createShipment as any);
    fastify.get("/:id", getShipmentById);
    fastify.put("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.MANAGER, StaffRole.REGION_MANAGER])]}, editShipment as any);
    fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.MANAGER, StaffRole.REGION_MANAGER])]}, deleteShipment as any);
}
