import {FastifyReply, FastifyRequest} from "fastify";
import {adminDataSource} from "../../../../../db/admin.orm.config.js";
import VendorConfig from "../../../../../db/entities/admin/config.entity.js";
import {ItemType, TypePricing,} from "../../../../../db/entities/vendor/item-type.entity.js";
import {ItemCategory} from "../../../../../db/entities/vendor/item-category.entity.js";
import {Order, OrderStatus, OrderType, StationOperation,} from "../../../../../db/entities/vendor/order.entity.js";
import {Customer, CustomerType,} from "../../../../../db/entities/vendor/customer.entity.js";
import {Station} from "../../../../../db/entities/vendor/stations.entity.js";
import {calcDistanceFactor, getDistance,} from "../../../../../lib/navigation.js";
import {History} from "../../../../../db/entities/vendor/history.entity.js";
import {User} from "../../../../../db/entities/vendor/users.entity.js";
import {State} from "../../../../../db/entities/vendor/states.entity.js";
import {generateTrackingCode} from "../../../../../lib/tracking-code-gen.js";
import {Receipt, ReceiptType} from "../../../../../db/entities/vendor/receipt.entity.js";
import PaymentType from "../../../../../custom-types/payment-type.js";
import {OrderPayment} from "../../../../../db/entities/vendor/order-payments.entity.js";
import {WalletPayment} from "../../../../../db/entities/vendor/wallet-payments.entity.js";
import {CorporateCustomer} from "../../../../../db/entities/vendor/corporate-customer.entity.js";
import {number} from "zod";

export async function getPrice(
  request: FastifyRequest<{ Body: Order }>,
  reply: FastifyReply
) {
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
  const configRepo = adminDataSource.getRepository(VendorConfig);
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
      freightPrice: parseFloat(freightPrice.toFixed(2)),
      totalAdditionalCharges: parseFloat(totalAdditionalCharges.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      insurance: insuranceCost ? parseFloat(insuranceCost.toFixed(2)) : undefined,
      vat: parseFloat(vat.toFixed(2)),
      total: parseFloat((subtotal + vat + insuranceCost).toFixed(2)),
    },
  });
}
export async function addOrder(
    request: FastifyRequest<{ Body: Order }>,
    reply: FastifyReply
) {

  const vendorDataSource = request.vendorDataSource;
  const user = request.user as User;
  const orderData = request.body
  if (!vendorDataSource || !user || !user.staff.officePersonnelInfo)
    return reply
        .status(401)
        .send({ success: false, message: "Unauthorized action" });
  if (!orderData ||!orderData.price)
    return reply
        .status(400)
        .send({ success: false, message: "Please provide necessary data" });
  const orderRepo = vendorDataSource.getRepository(Order);
  const historyRepo = vendorDataSource.getRepository(History);
  const stationsRepo = vendorDataSource.getRepository(Station);
  const stateRepo = vendorDataSource.getRepository(State);
  const originStation = await stationsRepo.findOneBy({ id: orderData.originStationId });
  const destinationStation = orderData.stationOperation === StationOperation.LOCAL? null: await stationsRepo.findOneBy({
    id: orderData.destinationStationId || orderData.destinationRegionStationId,
  });
  const originState = originStation? await stateRepo.findOneBy({id: originStation.stateId}): null
  if (!originState) return reply.status(400).send({ success: false, message: "Invalid order data" });
  const destinationState = destinationStation ? await stateRepo.findOneBy({id: destinationStation.stateId}): null
  const newOrder = orderRepo.create(orderData)
  newOrder.processedBy  = user.staff.officePersonnelInfo
  const hx = historyRepo.create({info: 'Order created successfully', performedById: user.staff.id});
  newOrder.status = OrderStatus.PENDING
  newOrder.trackingNumber= generateTrackingCode(originState.code, destinationState?.code || originState.code)
  newOrder.histories = [hx]
  const order = await newOrder.save()
  return reply.status(200).send({
    success: true,
    message: "Order created successfully",
    order
  });
}
export async function getOrder(
    request: FastifyRequest<{ Params: {id: string} }>,
    reply: FastifyReply
) {

  const vendorDataSource = request.vendorDataSource;
  const id = request.params.id;
  if (!vendorDataSource || !id )
    return reply
        .status(400)
        .send({ success: false, message: "invalid action" });
  const orderRepo = vendorDataSource.getRepository(Order);
  const order = await orderRepo.findOneBy({id});
  if (!order) return reply.status(404).send({ success: false, message: "Order not found" });

  return reply.status(200).send({
    success: true,
    message: "Order retrieved",
    order
  });
}
export async function setPayOnDelivery(
    request: FastifyRequest<{ Params: {id: string} }>,
    reply: FastifyReply
) {
  const vendorDataSource = request.vendorDataSource;
  const id = request.params.id;
  if (!vendorDataSource || !id )
    return reply
        .status(400)
        .send({ success: false, message: "invalid action" });
  const orderRepo = vendorDataSource.getRepository(Order);
  const order = await orderRepo.findOneBy({id});
  if (!order) return reply.status(404).send({ success: false, message: "Order not found" });
  if (![OrderStatus.PENDING, OrderStatus.ACCEPTED].includes(order.status) || order.paymentInfo)
    return reply.status(400).send({success: false, message: "Payment on delivery cannot be set, Order has either been paid for or shipped"});
  order.status = OrderStatus.ACCEPTED
  order.trackingInfo = order.trackingInfo? order.trackingInfo : [{info: 'Order accepted at origin station, will be shipped soon', time: new Date()}];
  order.payOnDelivery = true
  await  order.save()
  return reply.status(200).send({
    success: true,
    message: "Order set as pay on delivery",
  });
}
export async function payOrder(
    request: FastifyRequest<{ Params: {id: string}, Body: {paymentType: PaymentType, receiptInfo: string, amount: number}}>,
    reply: FastifyReply
) {
  const {amount, paymentType, receiptInfo} = request.body

  const vendorDataSource = request.vendorDataSource;
  const id = request.params.id;
  const user = request.user as User;
  if (!vendorDataSource || !id || !amount || !paymentType || !receiptInfo )
    return reply
        .status(400)
        .send({ success: false, message: "invalid action" });
  const orderRepo = vendorDataSource.getRepository(Order);
  const order = await orderRepo.findOneBy({id});
  if (!order) return reply.status(404).send({ success: false, message: "Order not found" });
  if (order.paymentInfo)
    return reply.status(400).send({success: false, message: "Order has either been already paid for"});
  console.log('total=',order.price.total, 'amount=',amount)
  if (+order.price.total !== +amount) return reply.status(400).send({success: false, message: "Amount not same as order price"});

    await vendorDataSource.transaction(async (manager)=> {
      const orderPaymentRepo = manager.getRepository(OrderPayment);
      const receiptRepo = manager.getRepository(Receipt);
      const historyRepo = manager.getRepository(History);
      const walletPayRepo = manager.getRepository(WalletPayment)
      const hx = historyRepo.create({info:'Payment for order made', performedById: user.staff.id});
      order.trackingInfo = order.trackingInfo? order.trackingInfo : [{info: 'Order accepted at origin station, will be shipped soon', time: new Date()}];
      if (order.status === OrderStatus.PENDING)  order.status = OrderStatus.ACCEPTED
      order.histories.push(hx);
      const customerRepo = manager.getRepository(Customer)
      const customer = await customerRepo.findOne({where:{id: order.customerId}, relations:{corporateCustomer: true}});
      if (!customer) throw new Error('Order Customer not found')
      order.paymentInfo = orderPaymentRepo.create({paymentType, orderId: order.id})
      if (paymentType === PaymentType.WALLET){
        if (customer.corporateCustomer.walletBalance < amount) throw new Error('Insufficient funds in wallet')
        customer.corporateCustomer.walletBalance -= amount
        await customer.corporateCustomer.save()
        const walletPayment = walletPayRepo.create({amount, corporateCustomerId: customer?.corporateCustomer.id, orderId: order.id, processedBy: user.staff.officePersonnelInfo! })
        await walletPayment.save()
        order.paymentInfo.walletPaymentId = walletPayment.id;
      }else {
        const orderReceipt =receiptRepo.create({orderId: order.id, amount, receiptInfo, receiptType: ReceiptType.ORDER_PAYMENT, customerId: order.customerId, corporateCustomerId: customer?.corporateCustomer?.id || undefined })
        await orderReceipt.save()
        order.paymentInfo.receiptId = orderReceipt.id;
      }
      await order.paymentInfo.save()
     await manager.save(order)
    }).then(()=> {return reply.status(200).send({
      success: true,
      message: "Payment success",
    })
    }).catch((error)=> {
      return reply.status(500).send({success: false, message: error.message || error.info || error});
    })


}
