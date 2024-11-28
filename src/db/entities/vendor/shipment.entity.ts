import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order.entity.js";
import { Trip } from "./trips.entity.js";
import {Station} from "./stations.entity.js";

export enum ShipmentStatus {
  CREATED = 'Created',
  LOADED = 'Loaded',
  TRANSIT = 'In-transit',
  DELAYED = 'Delayed',
  INTERMEDIATE = 'At Intermediate Station',
  DELIVERED = 'Delivered',
}
export enum ShipmentType{
  DIRECT = 'Direct',
  TRANSHIPMENT = 'Transhipment',
}
export enum ShipmentCoverage {
  LOCAL =  'Local',
  REGIONAL = 'Regional',
  INTRASTATE = 'Intrastate',
  INTERSTATE = 'Interstate'
}
@Entity()
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  code: string;
  @Column()
  status: ShipmentStatus;
  @Column()
  type: ShipmentType;
  @Column()
  coverage: ShipmentCoverage;
  @OneToMany(() => Order, (order) => order.shipment)
  orders: Relation<Order[]>;
  @ManyToOne(() => Station)
  origin: Relation<Station>;
  @Column()
  originId: string;
  @ManyToOne(() => Station)
  destination: Relation<Station>;
  @Column()
  destinationId: string;
  @ManyToOne(() => Trip, (trip) => trip.shipments)
  trip: Relation<Trip>;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
