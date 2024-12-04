import {FastifyReply, FastifyRequest} from "fastify";
import {adminDataSource} from "../../../../../db/admin.orm.config.js";
import Vendor from "../../../../../db/entities/admin/vendor.entity.js";
import VendorConfig from "../../../../../db/entities/admin/config.entity.js";

export async function createtConfig(
    request: FastifyRequest<{ Body: Omit<VendorConfig, "id"> & { logo: string } }>,
    reply: FastifyReply
) {
    const vendorId = request.vendorId!;
    const vendor = await adminDataSource
        .getRepository(Vendor)
        .findOneBy({id: vendorId});
    if (!vendor)
        return reply
            .status(401)
            .send({success: false, message: "Unauthorised action"});
    const {logo, ...config} = request.body
    vendor.logo = logo
    const configRepo = adminDataSource.getRepository(VendorConfig);
    vendor.config = configRepo.create({...config, vendorId});
    await configRepo.save(vendor.config);
    await vendor.save();
    return reply.send({
        success: true,
        message: "Config added",
        config: vendor.config,
    });
}

export async function updateConfig(
    request: FastifyRequest<{ Body: Partial<VendorConfig & { logo: string }> }>,
    reply: FastifyReply
) {
    const vendorId = request.vendorId!;
    const configRepo = adminDataSource.getRepository(VendorConfig);
    const vendor = await adminDataSource.getRepository(Vendor).findOneBy({id: vendorId});
    const config = await configRepo.findOneBy({id: request.body.id});
    if (!vendor || !config)
        return reply
            .status(401)
            .send({success: false, message: "Unauthorised action"});
    const {logo, ...configData} = request.body
    configRepo.merge(config, configData);
    await configRepo.save(config);
    if (logo) vendor.logo = logo;
    await vendor.save();
    return reply.send({
        success: true,
        message: "Config updated",
        config,
    });
}

export async function getConfig(request: FastifyRequest, reply: FastifyReply) {
    const vendorId = request.vendorId;
    console.log(vendorId);

    if (!vendorId)
        return reply
            .status(401)
            .send({success: false, message: "Unauthorised action"});
    const configRepo = adminDataSource.getRepository(VendorConfig);
    const config = await configRepo.findOneBy({vendorId});
    return reply.send({
        success: true,
        message: "Config",
        config,
    });
}
