import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../../../../../db/entities/vendor/users.entity.js";
import { StaffRegDTO } from "../dto/staff-registration-dtos.js";
import { Staff } from "../../../../../db/entities/vendor/staff.entity.js";
import { OfficePersonnel } from "../../../../../db/entities/vendor/office-staff.entity.js";
import { Driver } from "../../../../../db/entities/vendor/drivers.entity.js";
import { VehicleAssistant } from "../../../../../db/entities/vendor/vehicle-assistant.entity.js";
export async function getUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource) return;
  const user = await dataSource
    .getRepository(User)
    .findOneBy({ id: request.params.id });
  return reply.status(user ? 200 : 404).send({
    success: user ? true : false,
    message: user ? "Success" : "User not found",
    user: user ? user : undefined,
  });
}
export async function getUsers(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource) return;
  const users = await dataSource.getRepository(User).find();
  return reply.send({
    success: true,
    message: "Users list",
    users,
  });
}
export async function hasPin(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource) return;
  const user = await dataSource
    .getRepository(User)
    .findOneBy({ id: request.params.id });
  return reply.status(user ? 200 : 404).send({
    success: user ? true : false,
    message: user ? "Success" : "User not found",
    hasPin: user ? !!user.pin : undefined,
  });
}

export async function changePin(
  request: FastifyRequest<{
    Body: { oldPin: string; newPin: string; password: string };
  }>,
  reply: FastifyReply
) {
  const { oldPin, newPin, password } = request.body;
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply.status(404).send({ success: false, message: "No User found" });
  const currentUser = request.user;
  if (!currentUser)
    return reply
      .status(400)
      .send({ success: false, message: "Unauthorised action" });
  const user = await dataSource
    .getRepository(User)
    .findOneBy({ id: currentUser.id });
  if (!user)
    return reply.status(404).send({ success: false, message: "No User found" });
  if (user.pin && !(await user.validatePin(oldPin)))
    return reply
      .status(401)
      .send({ success: false, message: "Invalid credentials" });

  if (!(await user.validatePassword(password)))
    return reply
      .status(401)
      .send({ success: false, message: "Invalid credentials" });
  user.pin = newPin;
  await dataSource.getRepository(User).save(user);
  return reply.status(200).send({
    success: true,
    message: "Pin changed successfully",
  });
}

export async function changePassword(
  request: FastifyRequest<{
    Body: { oldPassword: string; newPassword: string; confirmPassword: string };
  }>,
  reply: FastifyReply
) {
  const { oldPassword, newPassword, confirmPassword } = request.body;
  console.log(oldPassword, newPassword, confirmPassword);

  if (newPassword !== confirmPassword)
    return reply
      .status(400)
      .send({ success: false, message: "Passwords do not match" });
  if (newPassword === oldPassword)
    return reply
      .status(400)
      .send({ success: false, message: "New password cannot be same as old" });
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(401)
      .send({ success: false, message: "Unauthorised action" });
  const currentUser = request.user;
  if (!currentUser)
    return reply
      .status(401)
      .send({ success: false, message: "Unauthorised action" });
  const user = await dataSource
    .getRepository(User)
    .findOneBy({ id: currentUser.id });
  if (!user)
    return reply.status(404).send({ success: false, message: "No User found" });
  if (!(await user.validatePassword(oldPassword)))
    return reply
      .status(401)
      .send({ success: false, message: "Invalid credentials" });
  user.password = newPassword;
  await dataSource.getRepository(User).save(user);
  return reply
    .status(200)
    .send({ success: true, message: "Password changed successfully" });
}
export async function createUser(
  request: FastifyRequest<{ Body: StaffRegDTO }>,
  reply: FastifyReply
) {
  const dataSource = request.vendorDataSource;
  if (!dataSource)
    return reply
      .status(401)
      .send({ success: false, message: "Unauthorised action" });
  console.log(request.body);

  const userRepo = dataSource.getRepository(User);
  const staffRepo = dataSource.getRepository(Staff);
  const officePersonnelRepo = dataSource.getRepository(OfficePersonnel);
  const driverRepo = dataSource.getRepository(Driver);
  const vehicleAssistantRepo = dataSource.getRepository(VehicleAssistant);
  const { user, staff, officePersonnelInfo, driverInfo, vehicleAssistantInfo } =
    request.body;
  if (
    (driverInfo && officePersonnelInfo) ||
    (driverInfo && vehicleAssistantInfo) ||
    (vehicleAssistantInfo && officePersonnelInfo)
  )
    return reply
      .status(400)
      .send({
        success: false,
        message:
          "Can only have one of office personnel, driver or vehicle assistant",
      });
  user.password = `${staff.firstname.toUpperCase()}.${staff.lastname.toLowerCase()}123`;
  const newuser = userRepo.create({
    ...user,
  });
  newuser.staff = staffRepo.create(staff);
  if (officePersonnelInfo)
    newuser.staff.officePersonnelInfo =
      officePersonnelRepo.create(officePersonnelInfo);
  if (driverInfo) newuser.staff.driverInfo = driverRepo.create(driverInfo);
  if (vehicleAssistantInfo)
    newuser.staff.vehicleAssistantInfo =
      vehicleAssistantRepo.create(vehicleAssistantInfo);

  await userRepo.save(newuser);
  delete (newuser as any).password;
  return { success: true, message: "User created successfully", user: newuser };
}
