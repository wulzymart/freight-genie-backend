import {RouteCoverage, RouteType} from "../../db/entities/vendor/routes.entity.js";
import {VehicleCoverage, VehicleType} from "../../db/entities/vendor/vehicles.entity.js";

export enum sortOrder {ASC = 'ASC' ,  DESC = 'DESC', asc = 'asc', desc =  'desc'
}
export type RoutesQueryStrings = {coverage?: RouteCoverage, type?: RouteType, order?: {type?: sortOrder, coverage?: sortOrder, code?: sortOrder}, take?: number, skip?: number}

export type VehiclesQueryStrings = {type?: VehicleType, coverage?: VehicleCoverage, currentStationId?: string, registeredToId?: string, order?: {type?: sortOrder, coverage?: sortOrder,}, take?: number, skip?: number}
