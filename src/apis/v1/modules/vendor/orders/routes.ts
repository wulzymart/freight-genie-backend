import {FastifyInstance} from "fastify";
import {addOrder, getOrder, getPrice, payOrder, setPayOnDelivery} from "./controllers.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function ordersRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return { mssg: "get all orders" };
  });
  fastify.post("/get-price", getPrice);
  fastify.post("/", {onRequest: [authorizationMiddlewareGenerator([StaffRole.MANAGER, StaffRole.STATION_OFFICER])]},addOrder as any);
  fastify.get("/:id", getOrder);
  fastify.put("/:id/pay-on-delivery", {onRequest: [authorizationMiddlewareGenerator([StaffRole.STATION_OFFICER, StaffRole.MANAGER, StaffRole.DIRECTOR])]},setPayOnDelivery as any);
  fastify.post("/:id/pay", {onRequest: [authorizationMiddlewareGenerator([StaffRole.STATION_OFFICER, StaffRole.MANAGER, StaffRole.DIRECTOR])]},payOrder as any);
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update order" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete order" };
  });
}
