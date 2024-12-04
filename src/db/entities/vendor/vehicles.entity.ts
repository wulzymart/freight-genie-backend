import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from "typeorm";
import {Station} from "./stations.entity.js";
import {Route} from "./routes.entity.js";
import {Trip} from "./trips.entity.js";
import {Driver} from "./drivers.entity.js";
import {VehicleAssistant} from "./vehicle-assistant.entity.js";
import {VehicleHistory} from "./vehicle-history.entity.js";

export enum VehicleCoverage {
    LOCAL = "local",
    REGIONAL = "regional",
    INTRASTATE = "intrastate",
    INTERSTATE = "interstate",
}

export enum VehicleType {
    BICYCLE = "bicycle",
    SCOOTER = "scooter",
    MOTORCYCLE = "motorcycle",
    TRICYCLE = "tricycle",
    CAR = "car",
    BUS = "bus",
    VAN = "van",
    TRUCK = "truck",
}

export enum VehicleStatus {
    AVAILABLE = "Available",
    DAMAGED = "Damaged",
    TRANSIT = "In-transit",
}

@Entity()
export class Vehicle extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({unique: true})
    registrationNumber: string;
    @Column({type: "enum", enum: VehicleType})
    type: VehicleType;
    @Column()
    model: string;
    @Column({type: "enum", enum: VehicleStatus, default: VehicleStatus.AVAILABLE})
    status: VehicleStatus;
    @Column({type: "enum", enum: VehicleCoverage})
    coverage: VehicleCoverage;
    @ManyToOne(() => Station, (station) => station.registeredVehicles, {
        nullable: true,
    })
    registeredTo: Relation<Station>;
    @Column()
    registeredToId: string;
    @Column()
    currentStationId: string;
    @ManyToOne(() => Station, (station) => station.availableVehicles, {
        nullable: true,
    })
    currentStation: Relation<Station>;
    @ManyToOne(() => Route, (route) => route.vehicles, {nullable: true})
    currentRoute: Relation<Route>
    @ManyToOne(() => Trip, (trip) => trip.vehicle, {nullable: true})
    currentTrip: Relation<Trip>
    @Column({nullable: true})
    currentTripId: string;
    @Column({nullable: true})
    currentRouteId: number;
    @Column({nullable: true})
    currentDriverId: string;
    @OneToOne(() => Driver, driver => driver.currentVehicle, {nullable: true})
    @JoinColumn()
    currentDriver: Relation<Driver>;
    @Column({nullable: true})
    currentVehicleAssistantId: string;
    @OneToOne(() => VehicleAssistant, assistant => assistant.currentVehicle, {nullable: true})
    @JoinColumn()
    currentVehicleAssistant: Relation<VehicleAssistant>;
    @OneToMany(() => VehicleHistory, history => history.vehicle, {cascade: ['update', 'insert'], onDelete: 'CASCADE'})
    history: Relation<VehicleHistory[]>
}
