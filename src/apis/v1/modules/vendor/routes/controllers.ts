import {FastifyReply, FastifyRequest} from "fastify";
import {Route} from "../../../../../db/entities/vendor/routes.entity.js";

import {RoutesQueryStrings} from "../../../../../custom-types/route-types/query-strings.js";
import {Station} from "../../../../../db/entities/vendor/stations.entity.js";
import {In, IsNull} from "typeorm";
import {getRouting} from "../../../../../lib/navigation.js";
import {Coordinate} from "../../../../../custom-types/route-types/routing-types.js";
import {Vehicle, VehicleStatus} from "../../../../../db/entities/vendor/vehicles.entity.js";

export async function getRoutingData(req: FastifyRequest, stationIds: string[]) {
    const vendorDataSource = req.vendorDataSource!
    const stationRepo = vendorDataSource.getRepository(Station)
    const stations = await stationRepo.findBy({id: In(stationIds)});
    const coordinates = stations.map(station => [station.longitude, station.latitude] as Coordinate);
    console.log(coordinates)
    const routingData = await getRouting(coordinates)
    console.log(routingData)
    return routingData
}


export async function addRoute(
    request: FastifyRequest<{ Body: Omit<Route, "id"> }>,
    reply: FastifyReply
) {
    const vendorDataSource = request.vendorDataSource!
    const routeData = request.body
    const routingData = await getRoutingData(request, routeData.stationIds)

    const routeRepo = vendorDataSource.getRepository(Route);
    const route = routeRepo.create({
        ...routeData,
    });
    await routeRepo.save(route);
    return reply.status(201).send({
        success: true,
        message: "Route added successfully",
        route,
    });
}

export async function getRoutes(request: FastifyRequest<{ Querystring: RoutesQueryStrings }>, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const search = request.query
    console.log("Routes Query", search)
    const {coverage, type} = search
    const routeRepo = vendorDataSource.getRepository(Route);
    const [routes, count] = await routeRepo.findAndCount({where: {coverage, type}, ...search});
    return reply.status(200).send({
        success: true,
        message: "Routes retrieved successfully",
        routes,
        count
    });
}

export async function getRoute(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const vendorDataSource = request.vendorDataSource!
    const routeRepo = vendorDataSource.getRepository(Route);
    const route = await routeRepo.findOne({
        where: {id: +request.params.id},
        relations: {
            vehicles: {
                currentDriver: {
                    staffInfo: true
                },
                currentVehicleAssistant: {
                    staffInfo: true
                },
                currentStation: true,
                currentTrip: true,
                registeredTo: true
            },
            drivers: {
                staffInfo: true,
                currentStation: true,
                registeredIn: true,
                registeredRoute: true
            },
            vehicleAssistants: {
                staffInfo: true,
                currentStation: true,
                registeredIn: true,
                registeredRoute: true
            }
        },
        select: {
            vehicles: {
                id: true,
                model: true,
                registrationNumber: true,
                status: true,
                type: true,
                coverage: true,
                currentStation: {
                    name: true
                },
                registeredTo: {
                    id: true,
                    name: true
                },
                currentTrip: {
                    id: true,
                    code: true
                },
                currentVehicleAssistant: {
                    staffInfo: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    }
                },
                currentDriver: {
                    staffInfo: {
                        id: true,
                        firstname: true,
                        lastname: true,
                    },
                    registeredRoute: {
                        id: true,
                        code: true
                    }
                }

            },
            drivers: {
                id: true,
                staffInfo: {
                    id: true,
                    firstname: true,
                    lastname: true
                },
                registeredRoute: {
                    id: true,
                    code: true
                },
                registeredIn: {
                    id: true,
                    name: true
                },
                currentStation: {
                    id: true,
                    name: true
                },
                operation: true
            },
            vehicleAssistants: {
                id: true,
                operation: true,
                staffInfo: {
                    id: true,
                    firstname: true,
                    lastname: true
                },
                registeredRoute: {
                    id: true,
                    code: true
                },
                registeredIn: {
                    id: true,
                    name: true
                },
                currentStation: {
                    id: true,
                    name: true
                }
            }
        }
    });
    if (!route)
        return reply.status(404).send({
            success: false,
            message: "Route not found",
        });
    return reply.status(200).send({
        success: true,
        message: "Route retrieved successfully",
        route,
    });
}

export async function updateRoutingData(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const vendorDataSource = request.vendorDataSource!
    const routeRepo = vendorDataSource.getRepository(Route);
    const routes = await routeRepo.find();
    for (const route of routes) {
        console.log(route.stationIds);

        route.routingInfo = await getRoutingData(request, route.stationIds)
        console.log(route.routingInfo);
        const saved = await route.save();
        console.log('route saved', saved);
    }

    return reply.status(200).send({
        success: true,
        message: "Routes updated",
    });
}

export async function editRoute(
    request: FastifyRequest<{ Params: { id: string }, Body: Partial<Route> }>,
    reply: FastifyReply
) {
    const vendorDataSource = request.vendorDataSource!
    const routeObj = request.body
    if (!routeObj || Object.keys(routeObj).length === 0) return reply.status(400).send({
        success: false,
        message: "Provide route edit object",
    });
    const routeRepo = vendorDataSource.getRepository(Route);
    const route = await routeRepo.findOneBy({id: +request.params.id});
    if (!route)
        return reply.status(404).send({
            success: false,
            message: "Route not found",
        });
    const updatedRoute = routeRepo.merge(route, routeObj);
    await routeRepo.save(updatedRoute);
    return reply.status(200).send({
        success: true,
        message: "Route updated",
        route: updatedRoute,
    });
}

export async function deleteRoute(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const vendorDataSource = request.vendorDataSource!
    const routeRepo = vendorDataSource.getRepository(Route);
    const route = await routeRepo.findOneBy({id: +request.params.id});
    if (!route)
        return reply.status(404).send({
            success: false,
            message: "Route not found",
        });
    await route.remove()
    return reply.status(200).send({
        success: true,
        message: "Route deleted",
    });
}

export async function getRouteVehicles(request: FastifyRequest<{
    Params: { id: string },
    Querystring: { search?: 'available' | 'addable' }
}>, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const routeRepo = vendorDataSource.getRepository(Route);
    const {search} = request.query
    const route = await routeRepo.findOne({
        where:
            {
                id: +request.params.id,
            }, relations: {vehicles: true},
    });
    if (!route)
        return reply.status(404).send({
            success: false,
            message: "Route not found",
        });
    if (search && search === 'addable') {
        const vehicles = await vendorDataSource.getRepository(Vehicle).find({
            where: {
                status: VehicleStatus.AVAILABLE,
                currentRouteId: IsNull(),
                registeredToId: In(route.stationIds)
            }
        })
        return reply.status(200).send({
            success: true,
            message: "Vehicles retrieved successfully",
            vehicles,
        });

    }


    if (search === 'available') {
        const availableVehicles = route.vehicles.filter(vehicle => vehicle.status === VehicleStatus.AVAILABLE)
        return reply.status(200).send({
            success: true,
            message: "Vehicles retrieved successfully",
            availableVehicles,
        });
    }

    return reply.status(200).send({
        success: true,
        message: "Route retrieved successfully",
        vehicles: route.vehicles,
    });
}

export async function addRouteVehicle(request: FastifyRequest<{
    Params: { id: number },
    Body: { vehicleId: string }
}>, reply: FastifyReply) {
    const {body, params: {id}, vendorDataSource} = request
    if (!body?.vehicleId) return reply.status(400).send({
        success: false,
        message: "Provide vehicle id",
    });
    const routeExists = await vendorDataSource!.getRepository(Route).existsBy({id: +id})
    if (!routeExists) return reply.status(404).send({
        success: false,
        message: "Route not found",
    })

    const vehicle = await vendorDataSource!.getRepository(Vehicle).findOneBy({id: body.vehicleId})
    if (!vehicle) return reply.status(404).send({
        success: false,
        message: "Vehicle not found",
    })
    if (vehicle.currentRouteId === +id) return reply.status(400).send({
        success: false,
        message: "Vehicle already in this route",
    })
    if (vehicle.currentRouteId) return reply.status(400).send({
        success: false,
        message: "Vehicle already in a route",
    })

    vehicle.currentRouteId = +id

    await vehicle.save()
    return reply.status(200).send({
        success: true,
        message: "Vehicle added to route",
    });
}