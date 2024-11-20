#!/usr/bin/env node
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
if (process.argv.length < 3) {
  console.log("Usage: node generate-superuser-token.js <superuser-name>");
  process.exit(1);
}

const userPayload = {
  name: process.argv[2],
};
const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
  expiresIn: 60 * 60,
});
console.log(token);
