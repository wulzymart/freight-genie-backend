import { FastifyInstance } from "fastify";
import { loginUser, validatePin } from "./controller.js";
import { authMiddleware } from "../../../middlewares/auth.js";

export const authRoute = async (fastify: FastifyInstance) => {
  fastify.post("/login", loginUser);
  fastify.post("/initiate-password-reset", async function (request, reply) {
    return { mssg: "initiate password reset route" };
  });

  fastify.post("/reset-password", async function (request, reply) {
    return { mssg: "reset password route" };
  });
  fastify.post(
    "/validate-pin",
    { onRequest: [authMiddleware] },
    validatePin as any
  );
  fastify.post("/initiate-pin-reset", async function (request, reply) {
    return { mssg: "initiate pin reset route" };
  });
  fastify.post("/reset-pin", async function (request, reply) {
    return { mssg: "reset pin route" };
  });
};
