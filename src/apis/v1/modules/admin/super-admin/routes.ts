import { FastifyInstance } from "fastify";
import { authRoute } from "../auth/route.js";
import { userRoutes } from "../users/routes.js";
import { vendorRoutes } from "../../vendor/routes.js";
import { validateSuperUserRoute } from "../../../middlewares/super-user.js";

export async function superAdminRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", validateSuperUserRoute);
  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(authRoute, { prefix: "/auth" });
  fastify.register(vendorRoutes, { prefix: "/vendors" });
}
