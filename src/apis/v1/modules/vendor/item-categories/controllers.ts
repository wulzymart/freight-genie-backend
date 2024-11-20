import { FastifyReply, FastifyRequest } from "fastify";
import { ItemCategory } from "../../../../../db/entities/vendor/item-category.entity.js";

export async function getItemCategories(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemCategoryRepo = dataSource.getRepository(ItemCategory);
  const itemCategories = await itemCategoryRepo.find();
  return reply.send({
    success: true,
    message: "Item Categories",
    itemCategories,
  });
}

export async function getItemCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemCategoryRepo = dataSource.getRepository(ItemCategory);
  const itemCategory = await itemCategoryRepo.findOneBy({
    id: +request.params.id,
  });
  return reply.send({
    success: true,
    message: "Item category",
    itemCategory,
  });
}

export async function createItemCategory(
  request: FastifyRequest<{
    Body: Omit<ItemCategory, "id">;
  }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemCategoryRepo = dataSource.getRepository(ItemCategory);
  const itemCategory = itemCategoryRepo.create(request.body);
  await itemCategoryRepo.save(itemCategory);
  return reply.send({
    success: true,
    message: "Item category created",
    itemCategory,
  });
}

export async function updateItemCategory(
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<ItemCategory>;
  }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemCategoryRepo = dataSource.getRepository(ItemCategory);
  const itemCategory = await itemCategoryRepo.findOneBy({
    id: +request.params.id,
  });
  if (!itemCategory)
    return reply
      .status(404)
      .send({ success: false, message: "Item category not found" });
  itemCategoryRepo.merge(itemCategory, request.body);
  await itemCategoryRepo.save(itemCategory);
  return reply.send({
    success: true,
    message: "Item category updated",
    itemCategory,
  });
}

export async function deleteItemCategory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(404)
      .send({ success: false, message: "Unauthorised action" });
  const itemCategoryRepo = dataSource.getRepository(ItemCategory);
  const itemCategory = await itemCategoryRepo.findOneBy({
    id: +request.params.id,
  });
  if (!itemCategory)
    return reply
      .status(404)
      .send({ success: false, message: "Item category not found" });
  await itemCategoryRepo.remove(itemCategory);
  return reply.send({
    success: true,
    message: "Item category deleted",
  });
}
