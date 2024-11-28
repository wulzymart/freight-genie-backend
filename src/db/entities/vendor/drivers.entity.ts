import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Station} from "./stations.entity.js";
import {Route} from "./routes.entity.js";
import {OperationEnum} from "../../../custom-types/field-staff.js";
import {Vehicle} from "./vehicles.entity.js";

export enum RouteCoverage {
    LOCAL = "Regional",
    INTRASTATE = "Intrastate-regions",
    INTERSTATE = "Interstate-regions",
}

export enum RouteType {
    REGULAR = "Regular",
    EXPRESS = "Express",
}

@Entity()
export class Driver extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => Staff)
    @JoinColumn()
    staffInfo: Relation<Staff>;
    @ManyToOne(() => Station, (station) => station.currentDrivers)
    currentStation: Relation<Station>;
    @Column()
    currentStationId: string;
    @ManyToOne(() => Station, (station) => station.registeredDrivers)
    registeredIn: Relation<Station>;
    @Column()
    registeredInId: string;
    @Column({type: "enum", enum: OperationEnum})
    operation: OperationEnum;
    @Column({type: "enum", enum: RouteCoverage})
    routeCoverage: RouteCoverage;
    @Column({type: "enum", enum: RouteType})
    routeType: RouteType;
    @ManyToOne(() => Route, (route) => route.drivers, {
        nullable: true,
    })
    registeredRoute: Relation<Route>;
    @Column({nullable: true})
    registeredRouteId: string;
    @OneToOne(() => Vehicle, (vehicle) => vehicle.currentDriver, {nullable: false})
    currentVehicle: Relation<Vehicle>;
    @Column({nullable: true})
    currentVehicleId: string
}
