import {FastifyInstance} from "fastify";
import {
  addRoute,
  addRouteVehicle,
  deleteRoute,
  editRoute,
  getRoute,
  getRoutes,
  getRouteVehicles
} from "./controllers.js";
import {RoutesQuerySchema} from "../../../../../schemas/routes.js";
import {serializerCompiler, validatorCompiler,} from 'fastify-type-provider-zod';
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function routesRoutes(fastify: FastifyInstance) {
    fastify.setValidatorCompiler(validatorCompiler)
    fastify.setSerializerCompiler(serializerCompiler)
    fastify.get("/", {
        schema: {
            querystring: RoutesQuerySchema,
        }
    }, getRoutes);
    // fastify.get('/update', updateRoutingData)
    fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, addRoute as any);
    fastify.get("/:id", getRoute);
    fastify.patch("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, editRoute as any);
    fastify.delete("/:id", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, deleteRoute as any);

    fastify.get('/:id/vehicles', getRouteVehicles)
    fastify.post('/:id/vehicles', {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])]}, addRouteVehicle as any)
}
