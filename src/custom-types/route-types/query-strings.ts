import {RouteCoverage, RouteType} from "../../db/entities/vendor/routes.entity.js";
import {VehicleCoverage, VehicleStatus, VehicleType} from "../../db/entities/vendor/vehicles.entity.js";
import {DriverStatus} from "../../db/entities/vendor/drivers.entity.js";
import {OperationEnum} from "../field-staff.js";
import {AssistantStatus} from "../../db/entities/vendor/vehicle-assistant.entity.js";
import {TripCoverage, TripStatus, TripType} from "../../db/entities/vendor/trips.entity.js";

export enum sortOrder {
    ASC = 'ASC', DESC = 'DESC', asc = 'asc', desc = 'desc'
}

export type RoutesQueryStrings = {
    coverage?: RouteCoverage,
    type?: RouteType,
    order?: { type?: sortOrder, coverage?: sortOrder, code?: sortOrder },
    take?: number,
    skip?: number
}

export type VehiclesQueryStrings = {
    type?: VehicleType,
    coverage?: VehicleCoverage,
    currentStationId?: string,
    registeredToId?: string,
    currentRouteId?: number,
    status?: VehicleStatus,
    order?: { type?: sortOrder, coverage?: sortOrder, },
    take?: number,
    skip?: number
}
export type TripsQueryStrings = {
    coverage?: TripCoverage;
    type?: TripType;
    status?: TripStatus;
    routeId?: number;
    from?: Date | string;
    to?: Date | string;
    order?: { type?: sortOrder; coverage?: sortOrder; code?: sortOrder };
    take?: number;
    skip?: number;
};
export type TripPersonnelQueryStrings = {
    type: 'driver' | 'assistant',
    operation?: OperationEnum;
    routeCoverage?: RouteCoverage,
    currentStationId?: string,
    registeredInId?: string,
    registeredRouteId?: number,
    routeType?: RouteType,
    status?: DriverStatus | AssistantStatus,
    order?: {
        type?: sortOrder,
        routeCoverage?: sortOrder,
        routeType?: sortOrder,
        operation?: sortOrder,
        status?: sortOrder
    },
    take?: number,
    skip?: number
}
