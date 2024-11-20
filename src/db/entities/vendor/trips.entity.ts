import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Vehicle } from "./vehicles.entity.js";
import { Driver } from "./drivers.entity.js";
import { VehicleAssistant } from "./vehicle-assistant.entity.js";
import { Shipment } from "./Shipmentment.entity.js";
import { Route } from "./routes.entity.js";

export enum TripCoverage {
  LOCAL = "local",
  INTRASTATE = "intrastate",
  INTERSTATE = "interstate",
}
@Entity()
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ type: "enum", enum: TripCoverage })
  coverage: TripCoverage;
  @OneToOne(() => Vehicle)
  @JoinColumn()
  vehicle: Relation<Vehicle>;
  @OneToOne(() => Driver)
  @JoinColumn()
  driver: Relation<Driver>;
  @OneToOne(() => VehicleAssistant)
  @JoinColumn()
  vehicleAssitant: Relation<VehicleAssistant>;
  @OneToMany(() => Shipment, (shipment) => shipment.trip)
  shipments: Relation<Shipment[]>;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => Route)
  route: Relation<Route>;
}
