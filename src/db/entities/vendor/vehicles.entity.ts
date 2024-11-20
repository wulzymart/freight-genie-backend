import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Station } from "./stations.entity.js";
import { Route } from "./routes.entity.js";
import { Trip } from "./trips.entity.js";

export enum VehicleCoverage {
  LOCAL = "local",
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

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ unique: true })
  registrationNumber: string;
  @Column({ type: "enum", enum: VehicleType })
  type: VehicleType;
  @Column()
  model: string;
  @Column({ type: "enum", enum: VehicleCoverage })
  coverage: VehicleCoverage;
  @ManyToOne(() => Station, (station) => station.registeredVehicles, {
    nullable: true,
  })
  registeredTo: Relation<Station>;
  @ManyToOne(() => Station, (station) => station.availableVehicles, {
    nullable: true,
  })
  currentStation: Relation<Station>;
  @ManyToOne(() => Route, (route) => route.vehicles, { nullable: true })
  currentRoute: Relation<Route> | null; //update with route
  @ManyToOne(() => Trip, (trip) => trip.vehicle, { nullable: true })
  currentTrip: Relation<Trip> | null; // update with trips
}
