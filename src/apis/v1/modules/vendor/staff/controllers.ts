import {FastifyReply, FastifyRequest} from "fastify";
import {TripPersonnelQueryStrings} from "../../../../../custom-types/route-types/query-strings.js";
import {Driver} from "../../../../../db/entities/vendor/drivers.entity.js";
import {VehicleAssistant} from "../../../../../db/entities/vendor/vehicle-assistant.entity.js";

export async function getAllTripStaff(request: FastifyRequest<{
    Querystring: TripPersonnelQueryStrings
}>, reply: FastifyReply) {
    const search = request.query
    const {
        type,
        routeCoverage,
        currentStationId,
        registeredInId,
        registeredRouteId,
        routeType,
        operation,
        status,
        ...rest
    } = search
    const [personnel, count] = await request.vendorDataSource!.getRepository(type === 'driver' ? Driver : VehicleAssistant).findAndCount({
        relations: {
            currentStation: true,
            registeredIn: true,
            registeredRoute: true,
            staffInfo: true,
            currentVehicle: true
        },
        select: {currentStation: {name: true}, registeredIn: {name: true}},
        where: {
            routeCoverage,
            routeType,
            operation,
            currentStationId,
            registeredInId,
            registeredRouteId,
            status: status as any
        }, ...rest
    })
    return reply.status(200).send({
        success: true, message: 'All vehicles retrieved successfully.', personnel, count
    })
}