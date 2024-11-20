import { FastifyReply, FastifyRequest } from "fastify";
import { ItemType } from "../../../../../db/entities/vendor/item-type.entity.js";

export async function getItemTypes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemTypeRepo = dataSource.getRepository(ItemType);
  const itemTypes = await itemTypeRepo.find();
  return reply.send({
    success: true,
    message: "Item types",
    itemTypes,
  });
}

export async function getItemType(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemTypeRepo = dataSource.getRepository(ItemType);
  const itemType = await itemTypeRepo.findOneBy({ id: +request.params.id });
  return reply.send({
    success: true,
    message: "Item type",
    itemType,
  });
}

export async function createItemType(
  request: FastifyRequest<{
    Body: Omit<ItemType, "id">;
  }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemTypeRepo = dataSource.getRepository(ItemType);
  const itemType = itemTypeRepo.create(request.body);
  await itemTypeRepo.save(itemType);
  return reply.send({
    success: true,
    message: "Item type created",
    itemType,
  });
}

export async function updateItemType(
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<ItemType>;
  }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemTypeRepo = dataSource.getRepository(ItemType);
  const itemType = await itemTypeRepo.findOneBy({ id: +request.params.id });
  if (!itemType)
    return reply
      .status(404)
      .send({ success: false, message: "Item type not found" });
  itemTypeRepo.merge(itemType, request.body);
  await itemTypeRepo.save(itemType);
  return reply.send({
    success: true,
    message: "Item type updated",
    itemType,
  });
}

export async function deleteItemType(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemTypeRepo = dataSource.getRepository(ItemType);
  const itemType = await itemTypeRepo.findOneBy({ id: +request.params.id });
  if (!itemType)
    return reply
      .status(404)
      .send({ success: false, message: "Item type not found" });
  await itemTypeRepo.remove(itemType);
  return reply.send({
    success: true,
    message: "Item type deleted",
  });
}
