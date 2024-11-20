import { StationType } from "../../../../../custom-types/station-types.js";

export class AddressDTO {
  streetAddress: string;
  stateId: number;
  cityId: number | null;
}

export class AddStationDTO {
  name: string;
  code: string;
  type: StationType;
  phoneNumbers: string[];
  stateId: number;
  lgaId: number;
  regionalStationId?: string;
}
