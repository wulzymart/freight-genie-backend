import {FastifyReply, FastifyRequest} from "fastify";
import {Trip} from "../../../../../db/entities/vendor/trips.entity.js";

export async function getAllTrips(request: FastifyRequest, reply: FastifyReply ) {
    const vendorDataSource = request.vendorDataSource!
    const trips = await  vendorDataSource.getRepository(Trip).find()
    return reply.status(200).send({
        success: true, message: 'All trips retrieved successfully.', trips
    })
}

export async  function getTripById(request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply ) {
    const vendorDataSource = request.vendorDataSource!
    const trip = await vendorDataSource.getRepository(Trip).findOneBy({id: request.params.id})
    if (!trip) return reply.status(404).send({success: false, message: 'trip not found.',})
    return reply.status(200).send({success: true, trip, message: 'trip retrieved'})
}

export async function createTrip(request: FastifyRequest<{Body: Partial<Trip>}>, reply: FastifyReply ) {
    const tripDataSource = request.vendorDataSource!
    const trip = await tripDataSource.getRepository(Trip).create(request.body).save()
    return reply.status(201).send({success: true, message: 'trip created', trip})
}

export async function editTrip(request: FastifyRequest<{Body: Partial<Trip>, Params: {id: string}}>, reply: FastifyReply){
    const tripDataSource = request.vendorDataSource!
    const trip = await tripDataSource.getRepository(Trip).findOneBy({id: request.params.id})
    if (!trip) return reply.status(404).send({success: false, message: 'trip not found.',})
    Object.assign(trip, request.body)
    await trip.save()
    return reply.status(201).send({success: true, message: 'trip updated', trip})
}

export async function deleteTrip(request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply ) {
    const tripDataSource = request.vendorDataSource!
    const trip = await tripDataSource.getRepository(Trip).delete({id: request.params.id})
    return reply.status(204).send({success: true, message: 'trip deleted', trip})
}