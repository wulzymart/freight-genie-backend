import { DataSource } from "typeorm";
import { User as AdminUser } from "./db/entities/admin/user.entity.js";
import { User as VendorUser } from "./db/entities/vendor/users.entity.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: AdminUser | VendorUser;
    vendorId?: string;
    vendorDataSource?: DataSource;
  }
}
