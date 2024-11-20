import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../constants.js";
import PublicUserRoles from "../../../custom-types/public-user-roles.js";
import { StaffRole } from "../../../custom-types/staff-role.types.js";
import { User as AdminUser } from "../../../db/entities/admin/user.entity.js";
import { User } from "../../../db/entities/vendor/users.entity.js";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const url = request.originalUrl;
  if (url.match(/^\/v1\/admin\/vendors\?url=+/)) {
    return;
  }
  if (!request.headers.authorization) {
    return reply
      .code(401)
      .send({ success: false, message: "Unauthorized access" });
  }
  const token = request.headers.authorization.split(" ")[1];

  if (!token) {
    console.log("no token");

    return reply
      .code(401)
      .send({ success: false, message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { complete: true }) as any;
    request["user"] = decoded.payload;
  } catch (error) {
    console.log("invalid token");

    return reply
      .code(401)
      .send({ success: false, message: "Unauthorized access" });
  }
}

export function authorizationMiddlewareGenerator(
  roles: PublicUserRoles[] | StaffRole[]
) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    console.log("auth generator");

    if (!request.user) {
      console.log("no user");

      return reply
        .code(401)
        .send({ success: false, message: "Unauthorized access" });
    }
    const user = request.user as User | AdminUser;
    const userRole = (user as User).staff?.role || user.role

    if (!roles.includes(userRole as never)) {
      console.log(request.user, roles);

      console.log("invalid role");
      return reply
        .code(401)
        .send({ success: false, message: "Unauthorized access" });
    }
  };
}
