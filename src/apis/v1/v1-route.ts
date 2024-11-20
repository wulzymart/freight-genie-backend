import { FastifyInstance } from "fastify";
import { adminRoutes } from "./modules/admin/routes.js";
import { vendorRoutes } from "./modules/vendor/routes.js";
import { getVendorConnection } from "./middlewares/vendor-id.js";

export async function v1Routes(fastify: FastifyInstance) {
  fastify.register(adminRoutes, { prefix: "/admin" });
  fastify.register(vendorRoutes, {
    prefix: "/vendor",
  });
}
