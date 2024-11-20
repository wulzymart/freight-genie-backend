import {
  StaffShortDTO,
  UserShortDTO,
} from "../../vendor/dto/staff-registration-dtos.js";
import Vendor from "../../../../../db/entities/admin/vendor.entity.js";

export class RegistrationDTO {
  registrationBody: string;
  registrationNumber: string;
}

export class VendorDTO implements Partial<Vendor> {
  companyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  domainName?: string;
  logo?: string;
}
export class EditVendorDTO implements Partial<Vendor> {
  address: string;
  phoneNumber: string;
  email: string;
  domainName?: string;
  logo?: string;
}
export class CreateVendorDTO {
  vendor: VendorDTO;
  user: UserShortDTO;
  staff: StaffShortDTO;
  regInfo: RegistrationDTO;
}
