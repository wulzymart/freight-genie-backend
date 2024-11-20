import { FastifyInstance } from "fastify";
import { fastify } from "../../../../server.js";
import { userRoutes } from "./users/routes.js";
import { vendorRoutes } from "./vendors/routes.js";
import { authRoute } from "./auth/route.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { superAdminRoutes } from "./super-admin/routes.js";

export const adminRoutes = async (fastify: FastifyInstance) => {
  fastify.register(authRoute, { prefix: "/auth" });
  fastify.register(superAdminRoutes, { prefix: "/super-user" });
  fastify.register(authenticatedRoutes, { prefix: "/" });
};

export const authenticatedRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", authMiddleware);
  fastify.register(userRoutes, {
    prefix: "/users",
    onRequest: [authMiddleware],
  });
  fastify.register(vendorRoutes, { prefix: "/vendors" });
};
