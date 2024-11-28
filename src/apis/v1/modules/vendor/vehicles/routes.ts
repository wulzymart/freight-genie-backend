import {FastifyInstance} from "fastify";
import {createVehicle, deleteVehicle, editVehicle, getAllVehicles, getVehicleById} from "./controllers.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function vehiclesRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllVehicles);
  fastify.post("/",{onRequest: authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.MANAGER])}, createVehicle as any);
  fastify.get("/:id", getVehicleById);
  fastify.put("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]},editVehicle as any);
  fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, deleteVehicle as any);
}
