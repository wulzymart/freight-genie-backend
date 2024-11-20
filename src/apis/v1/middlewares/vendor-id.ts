import { FastifyRequest } from "fastify";
import { getVendorDataSource } from "../../../db/vendor.orm.config.js";
import Vendor from "../../../db/entities/admin/vendor.entity.js";
import { adminDataSource } from "../../../db/admin.orm.config.js";

export async function getVendorConnection(request: FastifyRequest, reply: any) {
  const vendorId = request.headers["x-vendor-id"];

  if (!vendorId) {
    return reply.status(400).send("Vendor ID is missing");
  }
  if (
    !(await adminDataSource
      .getRepository(Vendor)
      .existsBy({ id: vendorId as string }))
  ) {
    return reply
      .status(404)
      .send({ success: false, message: "Vendor not found" });
  }
  request["vendorId"] = vendorId as string;
  const schemaName = `vendor_${(vendorId as string).replace(/-/g, "_")}`;
  const datasource = await getVendorDataSource(schemaName);
  request["vendorDataSource"] = datasource;
}
