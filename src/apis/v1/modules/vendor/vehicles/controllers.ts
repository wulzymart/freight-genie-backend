import {FastifyReply, FastifyRequest} from "fastify";
import {Vehicle} from "../../../../../db/entities/vendor/vehicles.entity.js";
import {VehiclesQueryStrings} from "../../../../../custom-types/route-types/query-strings.js";

export async function getAllVehicles(request: FastifyRequest<{
    Querystring: VehiclesQueryStrings
}>, reply: FastifyReply) {
    const search = request.query
    const {coverage, type, currentStationId, registeredToId} = search
    const vendorDataSource = request.vendorDataSource!
    const [vehicles, count] = await vendorDataSource.getRepository(Vehicle).findAndCount({
        relations: {
            currentStation: true,
            registeredTo: true
        },
        select: {currentStation: {name: true}, registeredTo: {name: true}},
        where: {type, coverage, currentStationId, registeredToId}, ...search
    })
    return reply.status(200).send({
        success: true, message: 'All vehicles retrieved successfully.', vehicles, count
    })
}

export async function getVehicleById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const vehicle = await vendorDataSource.getRepository(Vehicle).findOne({
        where: {
            id: request.params.id
        },
        relations: {currentStation: true, registeredTo: true,},
        select: {
            currentStation: {
                name: true,
            },
            registeredTo: {
                name: true
            }
        }

    })
    if (!vehicle) return reply.status(404).send({success: false, message: 'Vehicle not found.',})
    return reply.status(200).send({success: true, vehicle, message: 'Vehicle retrieved'})
}

export async function createVehicle(request: FastifyRequest<{ Body: Partial<Vehicle> }>, reply: FastifyReply) {
    const vehicleDataSource = request.vendorDataSource!
    const vehicle = await vehicleDataSource.getRepository(Vehicle).create(request.body).save()
    return reply.status(201).send({success: true, message: 'Vehicle created', vehicle})
}

export async function editVehicle(request: FastifyRequest<{
    Body: Partial<Vehicle>,
    Params: { id: string }
}>, reply: FastifyReply) {
    const vehicleDataSource = request.vendorDataSource!
    const vehicle = await vehicleDataSource.getRepository(Vehicle).findOneBy({id: request.params.id})
    if (!vehicle) return reply.status(404).send({success: false, message: 'Vehicle not found.',})
    Object.assign(vehicle, request.body)
    await vehicle.save()
    return reply.status(201).send({success: true, message: 'Vehicle updated', vehicle})
}

export async function deleteVehicle(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const vehicleDataSource = request.vendorDataSource!
    const vehicle = await vehicleDataSource.getRepository(Vehicle).delete({id: request.params.id})
    return reply.status(204).send({success: true, message: 'Vehicle deleted', vehicle})
}