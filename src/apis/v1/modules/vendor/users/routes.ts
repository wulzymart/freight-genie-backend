import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import {
  changePassword,
  changePin,
  createUser,
  getUser,
  getUsers,
  hasPin,
} from "./controllers.js";
import { authorizationMiddlewareGenerator } from "../../../middlewares/auth.js";
import { UserRole } from "../../../../../custom-types/vendor-user-role.types.js";
import { StaffRole } from "../../../../../custom-types/staff-role.types.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", getUsers);
  fastify.post(
    "/",
    { onRequest: [authorizationMiddlewareGenerator([StaffRole.DIRECTOR])] },
    createUser as (
      request: FastifyRequest<RouteGenericInterface>,
      reply: FastifyReply
    ) => Promise<any>
  );
  fastify.get("/:id", getUser);
  fastify.get("/:id/has-pin", hasPin);
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update user" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete user" };
  });
  fastify.patch("/change-password", changePassword);
  fastify.patch("/change-pin", changePin);
  fastify.post("/add-pin", async function (request, reply) {
    return { mssg: "add pin route" };
  });
}
