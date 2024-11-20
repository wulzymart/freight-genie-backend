import { FastifyInstance } from "fastify";
import { createtConfig, getConfig, updateConfig } from "./controller.js";

export async function configRoutes(fastify: FastifyInstance) {
  fastify.get("/", getConfig);
  fastify.post("/", createtConfig);
  fastify.patch("/", updateConfig);
}
