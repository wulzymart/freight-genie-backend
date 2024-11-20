import { FastifyInstance, FastifyRequest } from "fastify";
import { LoginDTO } from "../dtos/users.dto.js";
import { loginUser } from "./controller.js";

export const authRoute = async (fastify: FastifyInstance) => {
  fastify.post("/login", loginUser);
  fastify.post("/initiate-password-reset", async function (request, reply) {
    return { mssg: "initiate password reset route" };
  });

  fastify.post("/reset-password", async function (request, reply) {
    return { mssg: "reset password route" };
  });
};
