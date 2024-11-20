import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Staff } from "./staff.entity.js";
import { Order } from "./order.entity.js";
import { Customer } from "./customer.entity.js";
import {CorporateCustomer} from "./corporate-customer.entity.js";

@Entity()
export class History extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  info: string;
  @ManyToOne(() => Staff, (staff) => staff.actionsPerformed, { eager: true })
  performedBy: Relation<Staff>;
  @Column()
  performedById: string;
  @ManyToOne(() => Order, (order) => order.histories, { nullable: true })
  order: Relation<Order>;
  @ManyToOne(() => Customer, (customer) => customer.histories, {
    nullable: true,
  })
  customer: Relation<Customer>;
  @ManyToOne(() => CorporateCustomer, (customer) => customer.histories, {
    nullable: true,
  })
  corporateCustomer: Relation<Customer>;
  @CreateDateColumn()
  createdAt: Date;
}
