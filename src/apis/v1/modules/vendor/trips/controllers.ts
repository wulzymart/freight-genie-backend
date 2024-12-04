import {FastifyReply, FastifyRequest} from "fastify";
import {Trip, TripCoverage, TripStatus} from "../../../../../db/entities/vendor/trips.entity.js";
import {Driver, DriverStatus} from "../../../../../db/entities/vendor/drivers.entity.js";
import {AssistantStatus, VehicleAssistant} from "../../../../../db/entities/vendor/vehicle-assistant.entity.js";
import {Vehicle} from "../../../../../db/entities/vendor/vehicles.entity.js";
import {Route} from "../../../../../db/entities/vendor/routes.entity.js";
import {Station} from "../../../../../db/entities/vendor/stations.entity.js";
import {Between, DataSource, FindOptionsWhere, In, LessThanOrEqual, MoreThanOrEqual, Not} from "typeorm";
import {Coordinate} from "../../../../../custom-types/route-types/routing-types.js";
import {getRouting} from "../../../../../lib/navigation.js";
import {TripsQueryStrings} from "../../../../../custom-types/route-types/query-strings.js";
import {TripHistory} from "../../../../../db/entities/vendor/trip-history.entity.js";
import {User} from "../../../../../db/entities/vendor/users.entity.js";
import {VehicleHistory} from "../../../../../db/entities/vendor/vehicle-history.entity.js";

export async function getAllTrips(request: FastifyRequest<{
    Querystring: TripsQueryStrings
}>, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const {from, to, type, status, coverage, routeId, ...rest} = request.query
    const where: FindOptionsWhere<Trip> = {status: Not(TripStatus.COMPLETED), type, coverage, routeId,}
    if (status === 'All' as any) {
        where.status = undefined
    } else {
        if (status) {
            where.status = status
        }
    }
    if (from && to) {
        where.createdAt = Between(typeof from === 'string' ? new Date(from) : from, typeof to === 'string' ? new Date(to) : to)
    } else if (from) {
        where.createdAt = MoreThanOrEqual(typeof from === 'string' ? new Date(from) : from)
    } else if (to) {
        where.createdAt = LessThanOrEqual(typeof to === 'string' ? new Date(to) : to)
    }

    const trips = await vendorDataSource.getRepository(Trip).find({
        where,
        select: {
            id: true, type: true, coverage: true, status: true, createdAt: true, code: true, driver: {
                id: true, staffInfo: {
                    firstname: true, lastname: true,
                }
            },
            vehicleAssistant: {
                id: true, staffInfo: {
                    firstname: true, lastname: true,
                }
            },
            vehicle: {
                id: true, model: true, registrationNumber: true, type: true
            },
            route: {
                id: true, code: true
            },
            origin: {
                id: true, name: true, address: true
            },
            destination: {
                id: true, name: true, address: true
            },
            currentStationId: true,
            nextStationId: true
        },
        relations: {
            vehicle: true,
            driver: {staffInfo: true},
            vehicleAssistant: {staffInfo: true},
            route: true,
            origin: true,
            destination: true
        }, ...rest
    })
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
            destination: true,
            history: {
                performedBy: true
            }
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
            },
            history: {
                info: true, performedBy: {id: true, firstname: true, lastname: true}, createdAt: true
            }
        }
    })
    if (!trip) return reply.status(404).send({success: false, message: 'trip not found.',})
    return reply.status(200).send({success: true, trip, message: 'trip retrieved'})
}

export async function updateTripRouting(request: FastifyRequest<{
    Params: { id: string }
}>, reply: FastifyReply) {
    const tripDataSource = request.vendorDataSource!
    const trip = await tripDataSource.getRepository(Trip).findOneBy({id: request.params.id})
    if (!trip) return reply.status(404).send({success: false, message: 'trip not found.',})

    trip.routingInfo = await getTripRouting(trip, tripDataSource)
    await trip.save()
    return reply.status(201).send({success: true, message: 'trip updated', trip})
}

async function getTripRouting(tripData: Partial<Trip>, dataSource: DataSource) {
    const {originId, destinationId, routeId, returnTrip} = tripData
    const route = await dataSource.getRepository(Route).findOneBy({id: routeId})
    const stationRepo = dataSource.getRepository(Station)
    const stationIds = returnTrip ? route!.stationIds.reverse() : route!.stationIds
    const originIndex = stationIds.indexOf(originId!)
    const destinationIndex = destinationId ? stationIds.indexOf(destinationId) : -1
    if (destinationId) {
        const tripStationIds = stationIds.slice(originIndex, destinationIndex + 1)
        const stations = await stationRepo.findBy({id: In(tripStationIds)})
        const tripStations = tripStationIds.map(id => stations.find(station => station.id === id)!)
        const coordinates = tripStations.map(station => [station.longitude, station.latitude] as Coordinate);
        return await getRouting(coordinates)
    }
    return undefined
}

export async function createTrip(request: FastifyRequest<{ Body: Partial<Trip> }>, reply: FastifyReply) {
    const tripDataSource = request.vendorDataSource!
    const tripData = request.body
    const user = request.user! as User
    return await tripDataSource.transaction(async (manager) => {

        const vehicle = await manager.getRepository(Vehicle).findOne({
            where:
                {
                    id: tripData.vehicleId
                }, relations: {history: true}
        })
        const driver = await manager.getRepository(Driver).findOneBy({id: tripData.driverId})
        const assistant = await manager.getRepository(VehicleAssistant).findOneBy({id: tripData.vehicleAssistantId})
        if (!vehicle || !driver) throw new Error('vehicle or driver not found.', {cause: 404})
        if (tripData.coverage !== TripCoverage.LASTMAN && !assistant) throw new Error('assistant not found.', {cause: 404})
        tripData.routingInfo = await getTripRouting(tripData, tripDataSource);
        const trip = await manager.getRepository(Trip).create({
            ...request.body,
            history: [manager.getRepository(TripHistory).create({info: 'Trip Created', performedById: user.staff.id})]
        }).save()
        const vHxRepo = manager.getRepository(VehicleHistory)
        vehicle.currentTripId = trip.id
        vehicle.history.push(vHxRepo.create({info: `Vehicle added to trip ${trip.id}`, performedById: user.staff.id}))
        driver.currentTripId = trip.id
        vehicle.currentDriverId = driver.id

        driver.currentVehicleId = vehicle.id
        driver.status = DriverStatus.ASSIGNED
        vehicle.currentTripId = trip.id
        vehicle.history.push(vHxRepo.create({
            info: `Vehicle assigned to driver ${driver.id}`,
            performedById: user.staff.id
        }))
        if (assistant) {
            assistant.currentTripId = trip.id
            assistant.currentVehicleId = vehicle.id
            assistant.status = AssistantStatus.ASSIGNED
            vehicle.currentVehicleAssistantId = assistant.id
            vehicle.history.push(vHxRepo.create({
                info: `Vehicle assistant updated to ${assistant.id}`,
                performedById: user.staff.id
            }))
        }
        await vehicle.save()
        await driver.save()
        if (assistant) await assistant.save()
        return trip
    }).then(trip => reply.status(201).send({success: true, message: 'trip created', trip})).catch((error: Error) => {
        return reply.status(typeof error.cause === 'number' ? error.cause : 500).send({
            success: false,
            message: error.message || error.name || error.cause || 'An error occurred'
        })
    }).catch((error: Error) => {
        console.log(error)
        return reply.status(typeof error.cause === 'number' ? error.cause : 500).send({
            success: false,
            message: error.message || error.name || error.cause || 'An error occurred'
        })
    })
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