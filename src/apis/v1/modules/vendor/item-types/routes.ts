import { FastifyInstance } from "fastify";
import {
  createItemType,
  deleteItemType,
  getItemType,
  getItemTypes,
  updateItemType,
} from "./controllers.js";

export async function itemTypesRoutes(fastify: FastifyInstance) {
  fastify.get("/", getItemTypes);
  fastify.post("/", createItemType);
  fastify.get("/:id", getItemType);
  fastify.patch("/:id", updateItemType);
  fastify.delete("/:id", deleteItemType);
}
