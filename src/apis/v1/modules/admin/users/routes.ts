import { FastifyInstance, FastifyRequest } from "fastify";
import { addUser, getUser, getUsers } from "./controller.js";
import { User } from "../../../../../db/entities/admin/user.entity.js";
import PublicUserRoles from "../../../../../custom-types/public-user-roles.js";
import * as z from "zod";
import { error } from "console";
import {
  authMiddleware,
  authorizationMiddlewareGenerator,
} from "../../../middlewares/auth.js";
export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({
      message: "Email is required.",
    }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Password is required" }),
    role: z.enum([PublicUserRoles.ADMIN, PublicUserRoles.SUPERADMIN], {
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", async function (request, reply) {
    return reply
      .code(200)
      .send({ message: "Success", success: true, users: await getUsers() });
  });
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string" },
          },
        },
      },
      onRequest: [
        authorizationMiddlewareGenerator([PublicUserRoles.SUPERADMIN]),
      ],
    },
    async function (request: FastifyRequest<{ Body: User }>, reply) {
      const userData = request.body;
      const parsed = RegisterSchema.safeParse(userData);
      if (parsed.success) {
        return reply.code(201).send({
          message: "User added successfully",
          success: true,
          user: await addUser(userData),
        });
      } else {
        return reply.code(400).send({
          message: parsed.error.errors.map((err) => err.message).join(", "),
          success: false,
        });
      }
    }
  );
  fastify.post(
    "/super-user",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string" },
          },
        },
      },
    },
    async function (request: FastifyRequest<{ Body: User }>, reply) {
      const userData = request.body;
      console.log(userData);

      const parsed = RegisterSchema.safeParse(userData);
      if (parsed.success) {
        return reply.code(201).send({
          message: "User added successfully",
          success: true,
          user: await addUser(userData),
        });
      } else {
        return reply.code(400).send({
          message: parsed.error.errors.map((err) => err.message).join(", "),
          success: false,
        });
      }
    }
  );
  fastify.get(
    "/:id",
    async function (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply
    ) {
      const id = request.params.id;
      const user = await getUser(id);
      return reply.code(user ? 200 : 404).send({
        message: user ? "user found" : `user with id: ${id} not found`,
        success: user ? true : false,
        user: user,
      });
    }
  );
  fastify.put("/:id", async function (request, reply) {
    return { mssg: "update user" };
  });
  fastify.delete("/:id", async function (request, reply) {
    return { mssg: "delete user" };
  });

  fastify.post("/change-password", async function (request, reply) {
    return { mssg: "change password route" };
  });
}
