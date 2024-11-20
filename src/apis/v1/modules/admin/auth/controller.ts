import { FastifyReply, FastifyRequest } from "fastify";
import { LoginDTO } from "../dtos/users.dto.js";
import { userRepository } from "../users/controller.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../../../../constants.js";
import jwt from "jsonwebtoken";

export async function loginUser(
  request: FastifyRequest<{ Body: LoginDTO }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;
  const user = await userRepository.findOne({ where: { email } });
  if (user && (await user?.isValidPassword(password))) {
    const { hashPassword, hashUpdatePassword, password, ...rest } = user;
    const accessToken = jwt.sign({ ...rest, path: "admin" }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return reply
      .code(200)
      .send({ success: true, message: "Login successful", accessToken });
  }
  return reply
    .code(401)
    .send({ success: false, message: "Invalid credentials" });
}
