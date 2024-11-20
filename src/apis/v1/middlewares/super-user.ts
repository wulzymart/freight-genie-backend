import { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function validateSuperUserRoute(
  request: FastifyRequest,
  reply: any
) {
  const token = request.headers["x-token"];

  if (!token) {
    console.log("no token");

    return reply.status(400).send("token is missing");
  }
  try {
    jwt.verify(token as string, process.env.JWT_SECRET!);
    console.log("verified");

    return;
  } catch (error) {
    console.log(" there was an error", error);

    reply.status(401).send({ success: false, message: "Unauthorised access" });
  }
}
