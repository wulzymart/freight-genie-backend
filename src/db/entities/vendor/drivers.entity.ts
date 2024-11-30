import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Station} from "./stations.entity.js";
import {Route} from "./routes.entity.js";
import {OperationEnum} from "../../../custom-types/field-staff.js";
import {Vehicle} from "./vehicles.entity.js";
import {Trip} from "./trips.entity.js";

export enum RouteCoverage {
    LOCAL = "Regional",
    INTRASTATE = "Intrastate-regions",
    INTERSTATE = "Interstate-regions",
}

export enum RouteType {
    REGULAR = "Regular",
    EXPRESS = "Express",
}

export enum DriverStatus {
    AVAILABLE = "Available",
    ASSIGNED = "Assigned",
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
    @Column({type: "enum", enum: DriverStatus, default: DriverStatus.AVAILABLE})
    status: DriverStatus;
    @ManyToOne(() => Station, (station) => station.registeredDrivers)
    registeredIn: Relation<Station>;
    @Column()
    registeredInId: string;
    @Column({type: "enum", enum: OperationEnum})
    operation: OperationEnum;
    @Column({type: "enum", enum: RouteCoverage})
    routeCoverage?: RouteCoverage;
    @Column({type: "enum", enum: RouteType})
    routeType?: RouteType;
    @ManyToOne(() => Route, (route) => route.drivers, {
        nullable: true,
    })
    registeredRoute?: Relation<Route>;
    @Column({nullable: true})
    registeredRouteId?: number;
    @OneToOne(() => Vehicle, (vehicle) => vehicle.currentDriver, {nullable: true})
    currentVehicle?: Relation<Vehicle>;
    @OneToOne(() => Trip, (trip) => trip.driver, {nullable: true})
    currentTrip?: Relation<Trip>;
    @Column({nullable: true})
    currentTripId?: string;
    @Column({nullable: true})
    currentVehicleId?: string
}
