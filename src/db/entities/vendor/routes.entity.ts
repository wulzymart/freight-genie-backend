import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Vehicle } from "./vehicles.entity.js";
import { Driver } from "./drivers.entity.js";
import { VehicleAssistant } from "./vehicle-assistant.entity.js";

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
  @Column({ type: "enum", enum: RouteCoverage })
  coverage: RouteCoverage;
  @Column({ type: "enum", enum: RouteType })
  type: RouteType;
  @Column({ unique: true })
  code: string;
  @Column({ type: "simple-array" })
  stationIds: string[];
  @OneToMany(() => Vehicle, (vehicle) => vehicle.currentRoute)
  vehicles: Relation<Vehicle>;
  @OneToMany(() => Driver, (driver) => driver.registeredRoute)
  drivers: Relation<Driver[]>;
  @OneToMany(
    () => VehicleAssistant,
    (vehicleAssistant) => vehicleAssistant.registeredRoute
  )
  vehicleAssistants: Relation<VehicleAssistant[]>;
}
