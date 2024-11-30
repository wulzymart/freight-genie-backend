import {StaffRole} from "../../../../../custom-types/staff-role.types.js";
import {UserRole} from "../../../../../custom-types/vendor-user-role.types.js";
import {AddressDTO} from "./address.dto.js";

export class UserRegDTO {
    email: string;

    username: string;

    password: string;

    role: UserRole;
}

export class UserShortDTO {
    email: string;
}

export class OfficePersonnelDTO {
    stationId: string;
}

export class VehicleAssistantDTO {
    currentStationId: string;

    registeredRouteId: number;
}

export class DriverDTO {
    currentStationId: string;

    registeredRouteId: number;
}

export class StaffShortDTO {
    user: UserRegDTO;

    firstname: string;

    lastname: string;

    phoneNumber: string;
}

export class StaffRegDTO {
    user: UserRegDTO;

    staff: {
        firstname: string;

        lastname: string;

        phoneNumber: string;

        address: AddressDTO;

        role: StaffRole;
    };
    officePersonnelInfo: OfficePersonnelDTO | null;
    vehicleAssistantInfo: VehicleAssistantDTO | null;
    driverInfo: DriverDTO | null;
}
