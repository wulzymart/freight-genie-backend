import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Vendor from "../../../../../db/entities/admin/vendor.entity.js";
import { CreateVendorDTO, EditVendorDTO } from "../dtos/create-vendor.dto.js";
import { adminDataSource } from "../../../../../db/admin.orm.config.js";
import { DataSource } from "typeorm";
import {
  StaffShortDTO,
  UserShortDTO,
} from "../../vendor/dto/staff-registration-dtos.js";
import { getVendorDataSource } from "../../../../../db/vendor.orm.config.js";
import { User } from "../../../../../db/entities/vendor/users.entity.js";
import { Staff } from "../../../../../db/entities/vendor/staff.entity.js";
import { UserRole } from "../../../../../custom-types/vendor-user-role.types.js";
import { StaffRole } from "../../../../../custom-types/staff-role.types.js";
import { statesLgas } from "../../vendor/nigeria-states-cities.js";
import { State } from "../../../../../db/entities/vendor/states.entity.js";
import { Lga } from "../../../../../db/entities/vendor/lgas.entity.js";
import VendorConfig from "../../../../../db/entities/admin/config.entity.js";
import {OfficePersonnel} from "../../../../../db/entities/vendor/office-staff.entity.js";

const createVendor = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<Vendor> => {
  const { vendor, user, staff, regInfo } = req.body as CreateVendorDTO;
  const newVendor = adminDataSource
    .getRepository(Vendor)
    .create({ ...vendor, registration: regInfo });
  try {
    await adminDataSource.getRepository(Vendor).save(newVendor);
  } catch (error) {
    return reply.status(400).send({
      message: "Error creating vendor, Vendor with similar may details exists",
    });
  }
  const schemaName = `vendor_${newVendor.id.replace(/-/g, "_")}`;
  await adminDataSource.query(`CREATE SCHEMA ${schemaName}`);

  // Run migrations for the new schema
  await runMigrations(schemaName, user, staff);
  return newVendor;
};
async function setUpCoutryStatesCities(connection: DataSource) {
  Object.keys(statesLgas as any).map(async (state) => {
    const newState = new State();
    newState.name = state;
    Object.assign(newState, {
      ...(statesLgas[state] as any),
      latitude: +statesLgas[state].lat,
      longitude: +statesLgas[state].long,
      lgas: statesLgas[state].lgas.map((lga: string) => {
        const newLga = new Lga();
        newLga.name = lga;
        return newLga;
      }),
    });
    connection.getRepository(State).save(newState);
  });
}

async function getVendorByDomain(domain: string): Promise<Vendor | null> {
  const vendor = await adminDataSource
    .getRepository(Vendor)
    .findOne({ where: { domainName: domain } });
  return vendor;
}
async function getVendorById(id: string): Promise<Vendor | null> {
  const vendor = await adminDataSource
    .getRepository(Vendor)
    .findOne({ where: { id } });
  return vendor;
}

async function getVendors(): Promise<Vendor[]> {
  return await adminDataSource.getRepository(Vendor).find();
}

async function deleteVendor(id: string): Promise<void> {
  const vendor = await adminDataSource
    .getRepository(Vendor)
    .findOne({ where: { id } });
  await vendor?.remove();
}

async function editVendor(
  id: string,
  editVendor: EditVendorDTO
): Promise<Vendor | null> {
  const vendor = await adminDataSource
    .getRepository(Vendor)
    .findOne({ where: { id } });
  if (!vendor) return null;
  vendor.address = editVendor.address || vendor.address;
  vendor.phoneNumber = editVendor.phoneNumber || vendor.phoneNumber;
  vendor.email = editVendor.email || vendor.email;
  vendor.domainName = editVendor.domainName || vendor.domainName;
  vendor.logo = editVendor.logo || vendor.logo;
  await vendor.save();
  return vendor;
}
async function runMigrations(
  schemaName: string,
  user: UserShortDTO,
  staff: StaffShortDTO
) {
  console.log("here run migrations");

  const config = {
    ...VendorConfig,
    schema: schemaName,
  };

  const vendorDataSource = await getVendorDataSource(schemaName);
  // await vendorDataSource.runMigrations();
  await setUpCoutryStatesCities(vendorDataSource);
  const newUser = vendorDataSource.getRepository(User).create({
    ...user,
    password: `${staff.firstname.toUpperCase()}.${staff.lastname.toLowerCase()}123`,
    role: UserRole.STAFF,
  });
  newUser.staff = vendorDataSource
    .getRepository(Staff)
    .create({ ...staff, role: StaffRole.DIRECTOR });
  const officePersonnelRepo =  vendorDataSource.getRepository(OfficePersonnel);
  newUser.staff.officePersonnelInfo = officePersonnelRepo.create();

  await newUser.save();
  await vendorDataSource.destroy();
}
export {
  createVendor,
  getVendorByDomain,
  getVendorById,
  getVendors,
  deleteVendor,
  editVendor,
};
