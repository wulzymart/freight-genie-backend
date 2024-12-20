import {FastifyReply, FastifyRequest} from "fastify";
import {AddStationDTO} from "./dto.js";
import {Station} from "../../../../../db/entities/vendor/stations.entity.js";
import {StationType} from "../../../../../custom-types/station-types.js";

export async function addStation(
    request: FastifyRequest<{ Body: AddStationDTO }>,
    reply: FastifyReply
) {
    const stationRepo = request.vendorDataSource!.getRepository(Station);
    const stationData = request.body;
    if (stationData.type === StationType.LOCAL && !stationData.regionalStationId)
        return;
    const station = stationRepo.create(stationData);
    await stationRepo.save(station);
    return reply.status(201).send({
        success: true,
        message: "New Station added",
        station,
    });
}

export async function getStation(
    request: FastifyRequest<{ Querystring: { id?: string; name?: string } }>,
    reply: FastifyReply
) {
    const {id, name} = request.query;
    if (!id && !name)
        return reply.status(400).send({
            success: false,
            message: "Provide id or name query",
        });
    const stationRepo = request.vendorDataSource!.getRepository(Station);
    if (id) {
        const station = await stationRepo.findOne({
            where: {id},
            relations: {state: true, localStations: true},
            select: {
                state: {id: true, name: true, code: true, capitalCode: true},
                localStations: {id: true, name: true, code: true}
            },
        });

        return reply.status(station ? 200 : 404).send({
            success: !!station,
            message: station ? "Station Data" : "Station with name not found",
            station,
        });
    }
    if (name) {
        const station = await stationRepo.findOne({
            where: {name},
        });

        return reply.status(station ? 200 : 404).send({
            success: !!station,
            message: station ? "Station Data" : "Station with name not found",
            station,
        });
    }
}

export async function getStations(
    request: FastifyRequest<{
        Querystring: {
            stateId?: string;
            lgaId?: string;
            type: StationType;
            regionalStationId: string;
        };
    }>,
    reply: FastifyReply
) {
    const {stateId, lgaId, type, regionalStationId} = request.query;
    const stationRepo = request.vendorDataSource!.getRepository(Station);

    return reply.status(200).send({
        success: true,
        message: "Stations List",
        stations: await stationRepo.find({
            where: {
                type,
                regionalStationId,
                stateId: stateId ? +stateId : undefined,
                lgaId: lgaId ? +lgaId : undefined,
            },
            relations: {
                localStations: {state: true},
                state: true,
            },
            select: {
                localStations: {
                    id: true,
                    name: true,
                    code: true,
                    nickName: true,
                    state: {
                        name: true,
                        code: true,
                        id: true
                    }
                },
                state: {
                    id: true,
                    name: true,
                    code: true,
                    capitalCode: true,
                },
            }
        }),
    });
}
