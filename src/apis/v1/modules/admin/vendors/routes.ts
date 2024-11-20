import { FastifyInstance, FastifyRequest } from "fastify";
import {
  createVendor,
  getVendorByDomain,
  getVendorById,
  getVendors,
} from "./controllers.js";
import { Query } from "typeorm/driver/Query.js";

export const vendorRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    async function (
      request: FastifyRequest<{ Querystring: { url?: string } }>,
      reply
    ) {
      if (request.query.url) {
        const vendor = await getVendorByDomain(request.query.url);
        if (vendor) {
          return reply
            .code(200)
            .send({ message: "Success", success: true, vendor });
        } else
          reply.code(404).send({ message: "Vendor not found", success: false });
      }
      const vendors = await getVendors();
      return reply
        .code(200)
        .send({ message: "Success", success: true, vendors });
    }
  );
  fastify.post("/", createVendor);
  fastify.get(
    "/:id",
    async function (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply
    ) {
      const vendor = await getVendorById(request.params.id);
      return reply
        .code(vendor ? 200 : 404)
        .send({
          message: vendor ? "Success" : "Vendor not found",
          success: vendor ? true : false,
          vendor: vendor ? vendor : undefined,
        });
    }
  );
  fastify.get("/:id/config", async function (request, reply) {
    return { mssg: "get vendor config" };
  });
  fastify.get("/:id/payments", async function (request, reply) {
    return { mssg: "get vendor payments" };
  });
  fastify.get("/:id/subscriptions", async function (request, reply) {
    return { mssg: "get vendor subscriptions" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update vendor" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete vendor" };
  });
};
