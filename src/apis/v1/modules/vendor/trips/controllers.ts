import {FastifyReply, FastifyRequest} from "fastify";
import {Trip, TripCoverage} from "../../../../../db/entities/vendor/trips.entity.js";
import {Driver} from "../../../../../db/entities/vendor/drivers.entity.js";
import {VehicleAssistant} from "../../../../../db/entities/vendor/vehicle-assistant.entity.js";
import {Vehicle} from "../../../../../db/entities/vendor/vehicles.entity.js";

export async function getAllTrips(request: FastifyRequest, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const trips = await vendorDataSource.getRepository(Trip).find()
    return reply.status(200).send({
        success: true, message: 'All trips retrieved successfully.', trips
    })
}

export async function getTripById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const trip = await vendorDataSource.getRepository(Trip).findOne({
        where: {
            id: request.params.id
        },
        relations: {
            vehicle: true,
            driver: {staffInfo: true},
            vehicleAssistant: {staffInfo: true},
            route: true,
            origin: true,
            destination: true
        },
        select: {
            vehicle: {
                id: true,
                model: true,
                registrationNumber: true, type: true
            }, route: {
                id: true, code: true
            }, driver: {
                id: true, staffInfo: {
                    firstname: true, lastname: true, phoneNumber: true, id: true
                }
            }, vehicleAssistant: {
                id: true, staffInfo: {
                    firstname: true, lastname: true, phoneNumber: true, id: true
                }
            }, origin: {
                id: true, name: true, address: true
            }, destination: {
                id: true, name: true, address: true
            }
        }
    })
    if (!trip) return reply.status(404).send({success: false, message: 'trip not found.',})
    return reply.status(200).send({success: true, trip, message: 'trip retrieved'})
}

export async function createTrip(request: FastifyRequest<{ Body: Partial<Trip> }>, reply: FastifyReply) {
    const tripDataSource = request.vendorDataSource!
    const tripData = request.body
    const vehicle = await tripDataSource.getRepository(Vehicle).findOneBy({id: tripData.vehicleId})
    const driver = await tripDataSource.getRepository(Driver).findOneBy({id: tripData.driverId})
    const assistant = await tripDataSource.getRepository(VehicleAssistant).findOneBy({id: tripData.vehicleAssistantId})
    if (!vehicle || !driver) return reply.status(404).send({success: false, message: 'vehicle or driver not found.',})
    if (tripData.coverage !== TripCoverage.LASTMAN && !assistant) return reply.status(404).send({
        success: false,
        message: 'assistant not found.',
    })

    const trip = await tripDataSource.getRepository(Trip).create(request.body).save()
    vehicle.currentTrip = trip
    driver.currentTrip = trip
    driver.currentVehicle = vehicle
    if (assistant) {
        assistant.currentTrip = trip
        assistant.currentVehicle = vehicle
    }
    await vehicle.save()
    await driver.save()
    if (assistant) await assistant.save()
    return reply.status(201).send({success: true, message: 'trip created', trip})
}

export async function editTrip(request: FastifyRequest<{
    Body: Partial<Trip>,
    Params: { id: string }
}>, reply: FastifyReply) {
    const tripDataSource = request.vendorDataSource!
    const trip = await tripDataSource.getRepository(Trip).findOneBy({id: request.params.id})
    if (!trip) return reply.status(404).send({success: false, message: 'trip not found.',})
    Object.assign(trip, request.body)
    await trip.save()
    return reply.status(201).send({success: true, message: 'trip updated', trip})
}

export async function deleteTrip(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const tripDataSource = request.vendorDataSource!
    const trip = await tripDataSource.getRepository(Trip).delete({id: request.params.id})
    return reply.status(204).send({success: true, message: 'trip deleted', trip})
}