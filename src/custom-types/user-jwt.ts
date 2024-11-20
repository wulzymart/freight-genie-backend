import Vendor from "../db/entities/admin/vendor.entity.js";

export interface UserJwtPayload {
  id: string;
  name: string;
  email: string;
  vendor: Vendor;
}
