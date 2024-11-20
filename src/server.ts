import Fastify, { FastifyInstance, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { adminRoutes } from "./apis/v1/modules/admin/routes.js";
import { vendorRoutes } from "./apis/v1/modules/vendor/routes.js";
import { v1Routes } from "./apis/v1/v1-route.js";

export const fastify: FastifyInstance = Fastify({
  logger: true,
});
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
});
fastify.decorate("user", null);
fastify.register(v1Routes, { prefix: "/v1" });
fastify.get("/", async function (request, reply) {
  return { mssg: "hello world" };
});

try {
  fastify.listen({ port: 4000 });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
