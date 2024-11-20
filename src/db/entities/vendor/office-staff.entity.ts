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
import { Staff } from "./staff.entity.js";
import { Station } from "./stations.entity.js";
import { Order } from "./order.entity.js";

@Entity()
export class OfficePersonnel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @OneToOne(() => Staff)
  @JoinColumn()
  staffInfo: Relation<Staff>;
  @ManyToOne(() => Station, (station) => station.officePersonnel, {
    eager: true,
    nullable: true,
  })
  station: Relation<Station> | null;
  @Column()
  stationId: string;
  @OneToMany(() => Order, (order) => order.processedBy)
  orders: Relation<Order[]>;
}
