import { FastifyReply, FastifyRequest } from "fastify";
import {Route, RouteCoverage, RouteType} from "../../../../../db/entities/vendor/routes.entity.js";
import exp from "constants";
import {type} from "node:os";
import {RoutesQueryStrings, sortOrder} from "../../../../../custom-types/route-types/query-strings.js";

export async function addRoute(
  request: FastifyRequest<{ Body: Omit<Route, "id"> }>,
  reply: FastifyReply
) {
  const vendorDataSource = request.vendorDataSource;
  if (!vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });

  const routeRepo = vendorDataSource.getRepository(Route);
  const route = routeRepo.create({
    ...request.body,
  });
  await routeRepo.save(route);
  return reply.status(201).send({
    success: true,
    message: "Route added successfully",
    route,
  });
}

export async function getRoutes(request: FastifyRequest<{Querystring: RoutesQueryStrings}>, reply: FastifyReply) {
  const vendorDataSource = request.vendorDataSource;
  if (!vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  const {coverage,type} = request.query
  const routeRepo = vendorDataSource.getRepository(Route);
  const routes = await routeRepo.find({where: {coverage, type}, order: {type: 'ASC', coverage: 'ASC', code: 'ASC'}, take: 10, skip: 0});
  return reply.status(200).send({
    success: true,
    message: "Routes retrieved successfully",
    routes,
  });
}

export async function getRoute(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const vendorDataSource = request.vendorDataSource;
  if (!vendorDataSource)
    return reply.status(401).send({
      success: false,
      message: "Unauthorised action",
    });
  const routeRepo = vendorDataSource.getRepository(Route);
  const route = await routeRepo.findOneBy({ id: +request.params.id });
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
