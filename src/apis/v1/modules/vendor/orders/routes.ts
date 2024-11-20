import { FastifyInstance } from "fastify";
import { getPrice } from "./controllers.js";

export async function ordersRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all orders" };
  });
  fastify.post("/get-price", getPrice);
  fastify.post("/", async function (request, reply) {
    return { mssg: "create order" };
  });
  fastify.get("/:id", async function (request, reply) {
    return { mssg: "get order" };
  });
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update order" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete order" };
  });
}
