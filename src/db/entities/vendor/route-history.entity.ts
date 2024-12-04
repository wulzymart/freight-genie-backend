import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Route} from "./routes.entity.js";

@Entity()
export class RouteHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    info: string;
    @ManyToOne(() => Staff, (staff) => staff.routeActions)
    performedBy: Relation<Staff>;
    @Column()
    performedById: string;
    @ManyToOne(() => Route, (route) => route.history, {nullable: true})
    route: Relation<Route>;
    @CreateDateColumn()
    createdAt: Date;
}
