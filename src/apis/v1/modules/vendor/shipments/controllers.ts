import {FastifyReply, FastifyRequest} from "fastify";
import {Shipment} from "../../../../../db/entities/vendor/shipment.entity.js";
import {ShipmentHistory} from "../../../../../db/entities/vendor/shipment-history.entity.js";
import {User} from "../../../../../db/entities/vendor/users.entity.js";


export async function getAllShipments(request: FastifyRequest, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const shipments = await vendorDataSource.getRepository(Shipment).find()
    return reply.status(200).send({
        success: true, message: 'All shipments retrieved successfully.', shipments
    })
}

export async function getShipmentById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const vendorDataSource = request.vendorDataSource!
    const shipment = await vendorDataSource.getRepository(Shipment).findOne({
        where: {
            id: request.params.id
        },
        relations: {
            history: true,
            origin: {state: true},
            destination: {state: true},
            trip: {
                driver: {staffInfo: true},
                vehicleAssistant: {staffInfo: true},
                vehicle: true
            },
            orders: {
                originStation: true,
                destinationStation: true,
            }
        },
        select: {
            destination: {
                id: true,
                name: true,
                address: true,
                state: {
                    id: true,
                    name: true,
                }
            },
            origin: {
                id: true,
                name: true,
                address: true,
                state: {
                    id: true,
                    name: true,
                }
            },
            trip: {
                id: true,
                code: true,
                vehicle: {
                    id: true,
                    model: true,
                    registrationNumber: true,
                }, driver: {
                    id: true, currentVehicleId: true, staffInfo: {
                        firstname: true, lastname: true, phoneNumber: true, id: true
                    }
                }
            }

        }
    })
    if (!shipment) return reply.status(404).send({success: false, message: 'shipment not found.',})
    console.log(shipment.tripId)
    return reply.status(200).send({success: true, shipment, message: 'shipment retrieved'})
}

export async function createShipment(request: FastifyRequest<{ Body: Partial<Shipment> }>, reply: FastifyReply) {
    const dataSource = request.vendorDataSource!
    const hxRepo = dataSource.getRepository(ShipmentHistory);
    const shipment = await dataSource.getRepository(Shipment).create({
        ...request.body,
        history: [hxRepo.create({info: 'Shipment created', performedById: (request.user! as User).staff.id})]
    }).save()
    return reply.status(201).send({success: true, message: 'shipment created', shipment})
}

export async function editShipment(request: FastifyRequest<{
    Body: Partial<Shipment>,
    Params: { id: string }
}>, reply: FastifyReply) {
    const shipmentDataSource = request.vendorDataSource!
    const shipment = await shipmentDataSource.getRepository(Shipment).findOneBy({id: request.params.id})
    if (!shipment) return reply.status(404).send({success: false, message: 'shipment not found.',})
    Object.assign(shipment, request.body)
    await shipment.save()
    return reply.status(201).send({success: true, message: 'shipment updated', shipment})
}

export async function deleteShipment(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const shipmentDataSource = request.vendorDataSource!
    const shipment = await shipmentDataSource.getRepository(Shipment).delete({id: request.params.id})
    return reply.status(204).send({success: true, message: 'shipment deleted', shipment})
}