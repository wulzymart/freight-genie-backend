import {FastifyInstance} from "fastify";
import {createItemType, deleteItemType, getItemType, getItemTypes, updateItemType,} from "./controllers.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function itemTypesRoutes(fastify: FastifyInstance) {
    fastify.get("/", getItemTypes);
    fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, createItemType as any);
    fastify.get("/:id", getItemType);
    fastify.patch("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, updateItemType as any);
    fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, deleteItemType as any);
}
