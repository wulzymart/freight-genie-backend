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

@Entity()
export class Shipment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Order, (order) => order.shipment)
  orders: Relation<Order[]>;
  @ManyToOne(() => Trip, (trip) => trip.shipments)
  trip: Relation<Trip>;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
