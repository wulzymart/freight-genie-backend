import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Vehicle} from "./vehicles.entity.js";
import {Driver} from "./drivers.entity.js";
import {VehicleAssistant} from "./vehicle-assistant.entity.js";
import {RouteHistory} from "./route-history.entity.js";

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
export class Route extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({type: "enum", enum: RouteCoverage, nullable: true})
    coverage: RouteCoverage;
    @Column({type: "enum", enum: RouteType, nullable: true})
    type: RouteType;
    @Column({unique: true})
    code: string;
    @Column({type: "simple-array"})
    stationIds: string[];
    @Column({type: "simple-json", nullable: true})
    routingInfo: any
    @OneToMany(() => Vehicle, (vehicle) => vehicle.currentRoute)
    vehicles: Relation<Vehicle[]>;
    @OneToMany(() => Driver, (driver) => driver.registeredRoute)
    drivers: Relation<Driver[]>;
    @OneToMany(
        () => VehicleAssistant,
        (vehicleAssistant) => vehicleAssistant.registeredRoute
    )
    vehicleAssistants: Relation<VehicleAssistant[]>;
    @OneToMany(() => RouteHistory, (history) => history.route, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
    history: Relation<RouteHistory[]>
}
