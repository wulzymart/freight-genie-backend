import {FastifyReply, FastifyRequest} from "fastify";
import {Shipment} from "../../../../../db/entities/vendor/shipment.entity.js";


export async function getAllShipments(request: FastifyRequest, reply: FastifyReply ) {
    const vendorDataSource = request.vendorDataSource!
    const shipments = await  vendorDataSource.getRepository(Shipment).find()
    return reply.status(200).send({
        success: true, message: 'All shipments retrieved successfully.', shipments
    })
}

export async  function getShipmentById(request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply ) {
    const vendorDataSource = request.vendorDataSource!
    const shipment = await vendorDataSource.getRepository(Shipment).findOneBy({id: request.params.id})
    if (!shipment) return reply.status(404).send({success: false, message: 'shipment not found.',})
    return reply.status(200).send({success: true, shipment, message: 'shipment retrieved'})
}

export async function createShipment(request: FastifyRequest<{Body: Partial<Shipment>}>, reply: FastifyReply ) {
    const shipmentDataSource = request.vendorDataSource!
    const shipment = await shipmentDataSource.getRepository(Shipment).create(request.body).save()
    return reply.status(201).send({success: true, message: 'shipment created', shipment})
}

export async function editShipment(request: FastifyRequest<{Body: Partial<Shipment>, Params: {id: string}}>, reply: FastifyReply){
    const shipmentDataSource = request.vendorDataSource!
    const shipment = await shipmentDataSource.getRepository(Shipment).findOneBy({id: request.params.id})
    if (!shipment) return reply.status(404).send({success: false, message: 'shipment not found.',})
    Object.assign(shipment, request.body)
    await shipment.save()
    return reply.status(201).send({success: true, message: 'shipment updated', shipment})
}

export async function deleteShipment(request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply ) {
    const shipmentDataSource = request.vendorDataSource!
    const shipment = await shipmentDataSource.getRepository(Shipment).delete({id: request.params.id})
    return reply.status(204).send({success: true, message: 'shipment deleted', shipment})
}