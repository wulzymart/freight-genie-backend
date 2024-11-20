import { DataSource } from "typeorm";

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../constants.js";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log(
  "dir",
  __dirname + "/../modules/admin/entities/**/*.entity.{ts,js}"
);

export const adminORMConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [__dirname + "/entities/admin/**/*.entity.{ts,js}"],
  // migrations: [__dirname + '/modules/public/migrations/*{.ts,.js}'],
  // migrationsRun: true,
  synchronize: true,
};

export const datasoure = new DataSource(adminORMConfig);

export const adminDataSource = datasoure.isInitialized
  ? datasoure
  : await datasoure.initialize();
export default datasoure;
