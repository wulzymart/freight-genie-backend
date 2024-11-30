import {FastifyInstance} from "fastify";
import {createtConfig, getConfig, updateConfig} from "./controller.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function configRoutes(fastify: FastifyInstance) {
    fastify.get("/", getConfig);
    fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, createtConfig as any);
    fastify.patch("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, updateConfig as any);
}
