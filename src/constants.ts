import { config } from "dotenv";
config();

export const PORT = parseInt(process.env.PORT || "4000");
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT || "5432");
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || "86400");
export const MAX_POOL_SIZE = parseInt(process.env.MAX_POOL_SIZE || "20");
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
