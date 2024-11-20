import { FastifyInstance } from "fastify";
import {
  createAdditionalCharge,
  deleteAdditionalCharge,
  getAdditionalCharge,
  getAdditionalCharges,
  updateAdditionalCharge,
} from "./controllers.js";

export async function additionalChargesRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAdditionalCharges);
  fastify.post("/", createAdditionalCharge);
  fastify.get("/:id", getAdditionalCharge);
  fastify.patch("/:id", updateAdditionalCharge);
  fastify.delete("/:id", deleteAdditionalCharge);
}
