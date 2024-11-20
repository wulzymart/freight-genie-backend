import {FastifyInstance} from "fastify";
import {addOrder, getPrice} from "./controllers.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function ordersRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all orders" };
  });
  fastify.post("/get-price", getPrice);
  fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.MANAGER, StaffRole.STATION_OFFICER])]},addOrder as any);
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
