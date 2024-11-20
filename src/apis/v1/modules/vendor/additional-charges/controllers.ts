import { FastifyReply, FastifyRequest } from "fastify";
import { AdditionalCharge } from "../../../../../db/entities/vendor/additional-charges.entity.js";

export async function getAdditionalCharges(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const additionalChargeRepo = dataSource.getRepository(AdditionalCharge);
  const additionalCharges = await additionalChargeRepo.find();
  return reply.send({
    success: true,
    message: "Additional Charges",
    additionalCharges,
  });
}

export async function getAdditionalCharge(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const additionalChargeRepo = dataSource.getRepository(AdditionalCharge);
  const additionalCharge = await additionalChargeRepo.findOneBy({
    id: +request.params.id,
  });
  return reply.send({
    success: true,
    message: "Additional Charge",
    additionalCharge,
  });
}

export async function createAdditionalCharge(
  request: FastifyRequest<{
    Body: Omit<AdditionalCharge, "id">;
  }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const additionalChargeRepo = dataSource.getRepository(AdditionalCharge);
  const additionalCharge = additionalChargeRepo.create(request.body);
  await additionalChargeRepo.save(additionalCharge);
  return reply.send({
    success: true,
    message: "Additional Charge created",
    additionalCharge,
  });
}

export async function updateAdditionalCharge(
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<AdditionalCharge>;
  }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const additionalChargeRepo = dataSource.getRepository(AdditionalCharge);
  const additionalCharge = await additionalChargeRepo.findOneBy({
    id: +request.params.id,
  });
  if (!additionalCharge)
    return reply
      .status(404)
      .send({ success: false, message: "Additional Charge not found" });
  additionalChargeRepo.merge(additionalCharge, request.body);
  await additionalChargeRepo.save(additionalCharge);
  return reply.send({
    success: true,
    message: "Additional Charge updated",
    additionalCharge,
  });
}

export async function deleteAdditionalCharge(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const additionalChargeRepo = dataSource.getRepository(AdditionalCharge);
  const additionalCharge = await additionalChargeRepo.findOneBy({
    id: +request.params.id,
  });
  if (!additionalCharge)
    return reply
      .status(404)
      .send({ success: false, message: "Additional Charge not found" });
  await additionalChargeRepo.remove(additionalCharge);
  return reply.send({
    success: true,
    message: "Additional Charge deleted",
  });
}
