import {FastifyInstance} from "fastify";
import {
  addCustomer,
  getCustomerById,
  getCustomerByPhone,
  getCustomerCorporate,
  makeCustomerCorporate,
  validateCustomerId,
  walletRefill,
} from "./controllers.js";
import {authorizationMiddlewareGenerator} from "../../../middlewares/auth.js";
import {StaffRole} from "../../../../../custom-types/staff-role.types.js";

export async function customersRoutes(fastify: FastifyInstance) {
    fastify.get("/", async function (request, reply) {
        return {mssg: "get all customers"};
    });
    fastify.get("/validate/:id", validateCustomerId);
    fastify.post("/", addCustomer);
    fastify.post("/id/upgrade", {onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR, StaffRole.REGION_MANAGER, StaffRole.MANAGER])]}, makeCustomerCorporate as any);
    fastify.get("/:id", getCustomerById);
    fastify.get("/phone/:phoneNumber", getCustomerByPhone);
    fastify.put("/:id", async function (request, reply) {
        return {mssg: "update customer"};
    });
    fastify.delete("/:id", async function (request, reply) {
        return {mssg: "delete customer"};
    });
    fastify.get('/corporate/:id', getCustomerCorporate)
    fastify.post('/corporate/:id/wallet-refill', walletRefill)
}
