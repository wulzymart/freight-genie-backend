import {FastifyReply, FastifyRequest} from "fastify";
import {adminDataSource} from "../../../../../db/admin.orm.config.js";
import VendorConfig from "../../../../../db/entities/admin/config.entity.js";
import {ItemType, TypePricing,} from "../../../../../db/entities/vendor/item-type.entity.js";
import {ItemCategory} from "../../../../../db/entities/vendor/item-category.entity.js";
import {Order, OrderType, StationOperation,} from "../../../../../db/entities/vendor/order.entity.js";
import {Customer, CustomerType,} from "../../../../../db/entities/vendor/customer.entity.js";
import {Station} from "../../../../../db/entities/vendor/stations.entity.js";
import {calcDistanceFactor, getDistance,} from "../../../../../lib/navigation.js";

export async function getPrice(
  request: FastifyRequest<{ Body: Order }>,
  reply: FastifyReply
) {
  console.log(request.body)
  const vendorId = request.vendorId;
  if (!vendorId)
    return reply
      .status(401)
      .send({ success: false, message: "Unauthorised action" });
  const vendorDataSource = request.vendorDataSource;
  const {
    item,
    orderType,
    stationOperation,
    destinationStationId,
    originStationId,
    destinationRegionStationId,
    additionalCharges,
    insurance,
    customerId,
  } = request.body;

  if (!vendorDataSource)
    return reply
      .status(401)
      .send({ success: false, message: "Unauthorised action" });
  const dataSource = adminDataSource;

  const configRepo = dataSource.getRepository(VendorConfig);
  const config = await configRepo.findOneBy({ vendorId });
  const itemTypes = await vendorDataSource.getRepository(ItemType).find();
  const itemCategories = await vendorDataSource
    .getRepository(ItemCategory)
    .find();
  const itemType = itemTypes.find((type) => type.name === item.type);
  const itemCategory = itemCategories.find(
    (category) => category.name === item.category
  );

  const stationRepo = vendorDataSource.getRepository(Station);
  const originStation = await stationRepo.findOneBy({ id: originStationId });
  const destinationStation = stationOperation === StationOperation.LOCAL? null: await stationRepo.findOneBy({
    id: destinationStationId || destinationRegionStationId,
  });

  console.log('destinationStation', destinationStation, 'destinationId',destinationStationId || destinationRegionStationId );
  if(stationOperation === StationOperation.INTERSTATION && !destinationStation) return reply
      .status(401)
      .send({ success: false, message: "Invalid order data" });
  if (
    !originStation ||
    !itemType ||
    !itemCategory ||
    !config
  )
    return reply
      .status(401)
      .send({ success: false, message: "Invalid order data" });
  const origin = { lat: originStation.latitude, long: originStation.longitude };
  const destination =destinationStation ? {
    lat: destinationStation.latitude,
    long: destinationStation.longitude,
  } : null;
  const distance = destinationStation ? await getDistance(origin, destination!): 0;
  const customer = await vendorDataSource
    .getRepository(Customer)
    .findOneBy({ id: customerId });
  if (!customer)
    return reply
      .status(404)
      .send({ success: false, message: "Invalid order data" });
  let weight = item.weight || 1;
  if (item.length && item.width && item.height) {
    const volume = item.width * item.height * item.length;
    const dimWeight = volume / config.dim || 5000
    weight = weight > dimWeight ? weight : dimWeight;
  }
  const base =
    (itemType.pricing === TypePricing.FIXED
      ? itemType.price
      : itemType.price * weight) *
    itemCategory.priceFactor *
    (orderType === OrderType.EXPRESS ? config.expressFactor || 1 : 1) *
    (customer.customerType === CustomerType.CORPORATE
      ? config.ecommerceFactor / 100
      : 1);

  const freightPrice =
    stationOperation === StationOperation.LOCAL
      ? base * 0.8
      : base * calcDistanceFactor(distance);

  const totalAdditionalCharges = additionalCharges.reduce(
    (total, charge) => total + charge.price,
    0
  );

  const subtotal = parseFloat(freightPrice.toFixed(2)) + parseFloat(totalAdditionalCharges.toFixed(2));
  const vat = subtotal * (config.vat / 100);
  const insuranceCost = insurance.insured
    ? insurance.itemValue! * (config.insuranceFactor / 100)
    : 0;

  return reply.status(200).send({
    success: true,
    message: "Order price successfully calculated",
    price: {
      freightPrice: freightPrice.toFixed(2),
      totalAdditionalCharges: totalAdditionalCharges.toFixed(2),
      subtotal: subtotal.toFixed(2),
      insurance: insuranceCost ? insuranceCost.toFixed(2) : undefined,
      vat: vat.toFixed(2),
      total: (subtotal + vat + insuranceCost).toFixed(2),
    },
  });
}
