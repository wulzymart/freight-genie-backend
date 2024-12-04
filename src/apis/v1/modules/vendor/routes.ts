import {FastifyInstance} from "fastify";
import {authRoute} from "./auth/route.js";
import {stationsRoutes} from "./stations/routes.js";
import {userRoutes} from "./users/routes.js";
import {locationsRoutes} from "./locations/routes.js";
import {ordersRoutes} from "./orders/routes.js";
import {customersRoutes} from "./customers/routes.js";
import {tripsRoutes} from "./trips/routes.js";
import {routesRoutes} from "./routes/routes.js";
import {paymentsRoutes} from "./payments/routes.js";
import {vehiclesRoutes} from "./vehicles/routes.js";
import {chargesRoutes} from "./charges/routes.js";
import {expenseTypesRoutes} from "./expenses-types/routes.js";
import {expensesRoutes} from "./expenses/routes.js";
import {itemCategoriesRoutes} from "./item-categories/routes.js";
import {itemTypesRoutes} from "./item-types/routes.js";
import {authMiddleware} from "../../middlewares/auth.js";
import {getVendorConnection} from "../../middlewares/vendor-id.js";
import {additionalChargesRoutes} from "./additional-charges/routes.js";
import {configRoutes} from "./config/routes.js";
import {staffRoutes} from "./staff/routes.js";
import {shipmentsRoutes} from "./shipments/routes.js";

export async function vendorRoutes(fastify: FastifyInstance) {
    fastify.decorate("vendorId", null);
    fastify.decorate("vendorDataSource", null);
    fastify.addHook("preHandler", getVendorConnection);
    fastify.register(authRoute, {prefix: "/auth"});
    fastify.register(authenticatedRoutes, {prefix: "/"});
}

async function authenticatedRoutes(fastify: FastifyInstance) {
    fastify.addHook("onRequest", authMiddleware);
    fastify.register(additionalChargesRoutes, {prefix: "/additional-charges"});
    fastify.register(stationsRoutes, {prefix: "/stations"});
    fastify.register(userRoutes, {prefix: "/users"});
    fastify.register(staffRoutes, {prefix: "/staff"});
    fastify.register(locationsRoutes, {prefix: "/locations"});
    fastify.register(ordersRoutes, {prefix: "/orders"});
    fastify.register(customersRoutes, {prefix: "/customers"});
    fastify.register(tripsRoutes, {prefix: "/trips"});
    fastify.register(shipmentsRoutes, {prefix: "/shipments"});
    fastify.register(routesRoutes, {prefix: "/routes"});
    fastify.register(paymentsRoutes, {prefix: "/payments"});
    fastify.register(vehiclesRoutes, {prefix: "/vehicles"});
    fastify.register(chargesRoutes, {prefix: "/charges"});
    fastify.register(expenseTypesRoutes, {prefix: "/expense-types"});
    fastify.register(expensesRoutes, {prefix: "/expenses"});
    fastify.register(itemCategoriesRoutes, {prefix: "/item-categories"});
    fastify.register(itemTypesRoutes, {prefix: "/item-types"});
    fastify.register(configRoutes, {prefix: "/config"});
}
