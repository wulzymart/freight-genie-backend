import  * as z from  'zod'
import {RouteCoverage, RouteType} from "../db/entities/vendor/routes.entity.js";
import {sortOrder} from "../custom-types/route-types/query-strings.js";
export const RoutesQuerySchema = z.optional(
    z.object({
        coverage: z.optional(z.enum(Object.values(RouteCoverage) as any)),
        type: z.optional(z.enum(Object.values(RouteType) as any)),
        order: z.optional(
            z.object({
                type: z.optional(z.enum(Object.values(sortOrder) as any)),
                coverage: z.optional(z.enum(Object.values(sortOrder) as any)),
                code: z.optional(z.enum(Object.values(sortOrder) as any))
            })
        ),
        take: z.optional(z.string().regex(/\d+/).transform(x => +x)),
        skip: z.optional(z.string().regex(/\d+/).transform(x => +x))
    })
)