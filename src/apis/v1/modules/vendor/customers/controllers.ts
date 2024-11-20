import {FastifyReply, FastifyRequest} from "fastify";
import {NewCustomerDTO} from "../dto/customer.dto.js";
import {Customer, CustomerType} from "../../../../../db/entities/vendor/customer.entity.js";
import {History} from "../../../../../db/entities/vendor/history.entity.js";
import {Staff} from "../../../../../db/entities/vendor/staff.entity.js";
import {UserRole} from "../../../../../custom-types/vendor-user-role.types.js";
import {User} from "../../../../../db/entities/vendor/users.entity.js";
import {CorporateCustomer} from "../../../../../db/entities/vendor/corporate-customer.entity.js";
import PaymentType from "../../../../../custom-types/payment-type.js";
import {Receipt, ReceiptType} from "../../../../../db/entities/vendor/receipt.entity.js";


export async function addCustomer(
  request: FastifyRequest<{ Body: NewCustomerDTO }>,
  reply: FastifyReply
) {
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  const customerRepo = request.vendorDataSource.getRepository(Customer);
  const historyRepo = request.vendorDataSource.getRepository(History);
  const staffRepo = request.vendorDataSource.getRepository(Staff);
  const staff = await staffRepo.findOne({
    where: { user: { id: request.user!.id } },
  });
  if (!staff)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action, Staff not found",
    });
  const customerData = request.body;
  const customer = customerRepo.create(customerData);
  const history = historyRepo.create({
    info: "Customer created",
    performedBy: staff!,
  });
  customer.histories = [history];
  await customerRepo.save(customer);
  return reply.status(201).send({
    success: true,
    message: "Customer added successfully",
    customer,
  });
}

export async function validateCustomerid(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  const customerRepo = request.vendorDataSource.getRepository(Customer);

  if (await customerRepo.existsBy({ id: request.params.id }))
    return reply.status(200).send({
      success: true,
      message: "Customer exists",
    });
  return reply.status(404).send({
    success: false,
    message: "Customer not found",
  });
}
export async function getCustomerByid(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  const customerRepo = request.vendorDataSource.getRepository(Customer);
  const customer = await customerRepo.findOne({where:{ id: request.params.id }, relations:{corporateCustomer: true}});
  if (customer)
    return reply.status(200).send({
      success: true,
      message: "Customer found",
      customer,
    });
  return reply.status(404).send({
    success: false,
    message: "Customer not found",
  });
}

export async function getCustomerByPhone(
  request: FastifyRequest<{ Params: { phoneNumber: string } }>,
  reply: FastifyReply
) {
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  if (!request.vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  const customerRepo = request.vendorDataSource.getRepository(Customer);
  const customer = await customerRepo.findOneBy({
    phoneNumber: request.params.phoneNumber,
  });
  if (customer)
    return reply.status(200).send({
      success: true,
      message: "Customer found",
      customer,
    });
  return reply.status(404).send({
    success: false,
    message: "Customer not found",
  });
}
export async function makeCustomerCorporate(request: FastifyRequest<{Params: {id: string}, Body: {
    user: {
      username: string,
      email: string,
      role: UserRole.CUSTOMER,
    },
    corporateInfo: {
      businessName: string,
      businessAddress: {
        stateId:  number,
        address: string
      },
      businessPhone: string
    },
  }}>, reply: FastifyReply) {
  const {user:userInfo, corporateInfo} = request.body
  const vendorDataSource = request.vendorDataSource;
  const user = request.user
  if (!vendorDataSource || !user) return reply.status(401).send({success: false, message: "Unauthorised action", });
  const customerRepo = vendorDataSource.getRepository(Customer);
  const customer = await customerRepo.findOneBy({id: request.params.id})
  if (!customer) return reply.status(404).send({success: false, message: "Customer not found", });
  const userRepo = vendorDataSource.getRepository(User);
  const corporateCustomerRepo = vendorDataSource.getRepository(CorporateCustomer);

  const newUser = userRepo.create({...userInfo, password: `${customer.firstname}.${customer.lastname}`});
  const newCorporateCustomer = corporateCustomerRepo.create({...corporateInfo})
  newUser.customer = newCorporateCustomer
  await newUser.save();
  customer.customerType = CustomerType.CORPORATE
  customer.corporateCustomer = newCorporateCustomer
  const historyRepo = vendorDataSource.getRepository(History);
  customer.histories.push(historyRepo.create({info: `Customer upgraded to corporate}`, performedById: (user as User).staff.id}))
  await customer.save()
  return reply.status(201).send({success: true, message: "Corporate Customer created", corporateCustomer: newCorporateCustomer });
}
export async function getCustomerCorporate(request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
  const vendorDataSource = request.vendorDataSource;
  if (!vendorDataSource) return reply.status(401).send({success: false, message: "Unauthorised action", });

  const corporateCustomerRepo = vendorDataSource.getRepository(CorporateCustomer);
  const id = request.params.id;
  const isPhone = /^\+234\d{10}$/.test(id);

  const corporateCustomer = await corporateCustomerRepo.findOne({where:{businessPhone: isPhone ? id: undefined, id: !isPhone? id : undefined}, relations:{
      customerInfo: true,
    }, select: {
    customerInfo: {
      firstname: true, lastname: true, phoneNumber: true, address: {address: true, stateId: true}, orders: true, email: true, createdAt: true, updatedAt: false
    }
    }})
  if (!corporateCustomer) return reply.status(404).send({success: false, message: "Customer not found", });

  return reply.status(201).send({success: true, message: "corporate customer found", corporateCustomer });
}

export async function walletRefill(request: FastifyRequest<{Params: {id: string}, Body: {amount: number, paymentType: PaymentType, receiptInfo: string}}>, reply: FastifyReply ) {
  const vendorDataSource = request.vendorDataSource;
  const user = request.user as User
  if (!vendorDataSource || !user) return reply.status(401).send({success: false, message: "Unauthorised action", });
  const corporateCustomerRepo = vendorDataSource.getRepository(CorporateCustomer);
  const id = request.params.id;
  const isPhone = /^\+234\d{10}$/.test(id);
  const corporateCustomer = await corporateCustomerRepo.findOne({where:{businessPhone: isPhone ? id: undefined, id: !isPhone? id : undefined}})
  if (!corporateCustomer) return reply.status(404).send({success: false, message: "Corporate Customer not found", });
  const historyRepo = vendorDataSource.getRepository(History);
  const {amount, paymentType, receiptInfo} = request.body
  if (!amount ||!paymentType || !receiptInfo) return reply.status(401).send({success: false, message: "Invalid payment information", });
  corporateCustomer.walletBalance += amount
  const hx = historyRepo.create({info: `Wallet refilled by ${amount}NGN`, performedById: (user).staff.id})
  corporateCustomer.histories? corporateCustomer.histories.push(hx): corporateCustomer.histories = [hx]
  const receiptRepo = vendorDataSource.getRepository(Receipt);
  const newReceipt = receiptRepo.create({receiptType: ReceiptType.WALLET_REFILL, amount, receiptInfo, corporateCustomerId: corporateCustomer.id})
  await corporateCustomer.save()
  await newReceipt.save();
  return reply.status(201).send({success: true, message: "Wallet refill successful"});
}
