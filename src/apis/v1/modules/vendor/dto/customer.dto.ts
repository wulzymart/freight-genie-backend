import { Customer } from "../../../../../db/entities/vendor/customer.entity.js";

export class NewCustomerDTO {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  address: {
    stateId: number;
    address: string;
  };
  created_at: Date;
  updated_at: Date;
}
