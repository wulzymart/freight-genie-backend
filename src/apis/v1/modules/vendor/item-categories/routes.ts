import {FastifyInstance} from "fastify";
import {
  createItemCategory,
  deleteItemCategory,
  getItemCategories,
  getItemCategory,
  updateItemCategory,
} from "./controllers.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function itemCategoriesRoutes(fastify: FastifyInstance) {
    fastify.get("/", getItemCategories);
    fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, createItemCategory as any);
    fastify.get("/:id", getItemCategory);
    fastify.patch("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, updateItemCategory as any);
    fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, deleteItemCategory as any);
}
