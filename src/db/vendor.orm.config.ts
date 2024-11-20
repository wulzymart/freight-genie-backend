import { adminORMConfig } from "./admin.orm.config.js";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const vendorORMConfig: PostgresConnectionOptions = {
  ...adminORMConfig,
  entities: [__dirname + "/entities/vendor/**/*.entity.{ts,js}"],
};
const vendorDataSources: { [key: string]: DataSource } = {};
export async function getVendorDataSource(schema: string) {
  if (vendorDataSources[schema] !== undefined) {
    if (vendorDataSources[schema].isInitialized) {
      return vendorDataSources[schema];
    } else {
      await vendorDataSources[schema].initialize();
      return vendorDataSources[schema];
    }
  }
  vendorDataSources[schema] = await new DataSource({
    ...vendorORMConfig,
    schema,
  }).initialize();
  return vendorDataSources[schema];
}

export default new DataSource(vendorORMConfig);
