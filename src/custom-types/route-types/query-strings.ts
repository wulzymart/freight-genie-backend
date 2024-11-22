import {RouteCoverage, RouteType} from "../../db/entities/vendor/routes.entity.js";

export type sortOrder = 'ASC' |'DESC' | 'asc' | 'desc'
export type RoutesQueryStrings = {coverage?: RouteCoverage, type?: RouteType, order?: {type?: sortOrder, coverage?: sortOrder, code?: sortOrder}, take?: number, skip?: number}
