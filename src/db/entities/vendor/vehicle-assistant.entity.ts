import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Station} from "./stations.entity.js";
import {Route} from "./routes.entity.js";
import {OperationEnum,} from "../../../custom-types/field-staff.js";
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

export enum AssistantStatus {
    AVAILABLE = "Available",
    ASSIGNED = "Assigned",
}

@Entity()
export class VehicleAssistant extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => Staff)
    @JoinColumn()
    staffInfo: Relation<Staff>;
    @ManyToOne(() => Station, (station) => station.currentVehicleAssistants)
    currentStation: Relation<Station>;
    @ManyToOne(() => Station, (station) => station.registeredVehicleAssistants)
    registeredIn: Relation<Station>;
    @Column()
    registeredInId: string;
    @Column()
    currentStationId: string;
    @Column({type: "enum", enum: AssistantStatus, default: AssistantStatus.AVAILABLE})
    status: AssistantStatus;
    @Column({type: "enum", enum: OperationEnum})
    operation: OperationEnum;
    @Column({nullable: true, type: "enum", enum: RouteCoverage})
    routeCoverage?: RouteCoverage;
    @Column({nullable: true, type: "enum", enum: RouteType})
    routeType?: RouteType;
    @ManyToOne(() => Route, (route) => route.vehicleAssistants, {
        nullable: true,
    })
    registeredRoute: Relation<Route>;
    @Column({nullable: true})
    registeredRouteId?: number;
    @OneToOne(() => Trip, (trip) => trip.vehicleAssistant, {nullable: true})
    currentTrip?: Relation<Trip>;
    @Column({nullable: true})
    currentTripId?: string;
    @OneToOne(() => Vehicle, (vehicle) => vehicle.currentVehicleAssistant, {nullable: true})
    currentVehicle?: Relation<Vehicle>;
    @Column({nullable: true})
    currentVehicleId?: string
}
