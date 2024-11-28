import { FastifyInstance } from "fastify";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";
import {createShipment, deleteShipment, editShipment, getAllShipments, getShipmentById} from "./controllers.js";

export async function shipmentsRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllShipments);
  fastify.post("/",{onRequest: authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.MANAGER])}, createShipment as any);
  fastify.get("/:id", getShipmentById);
  fastify.put("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]},editShipment as any);
  fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, deleteShipment as any);
}
