import { FastifyInstance } from "fastify";
import {
  createItemCategory,
  deleteItemCategory,
  getItemCategories,
  getItemCategory,
  updateItemCategory,
} from "./controllers.js";

export async function itemCategoriesRoutes(fastify: FastifyInstance) {
  fastify.get("/", getItemCategories);
  fastify.post("/", createItemCategory);
  fastify.get("/:id", getItemCategory);
  fastify.patch("/:id", updateItemCategory);
  fastify.delete("/:id", deleteItemCategory);
}
