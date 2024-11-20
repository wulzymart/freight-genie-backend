import { AbstractEntity } from "../abstract.entity.js";
import { Column, Entity, ManyToOne, OneToOne, Relation } from "typeorm";
import Vendor from "./vendor.entity.js";
import Payment from "./payment.entity.js";

@Entity()
export default class Subscription extends AbstractEntity {
  @Column({ type: "timestamp" })
  startDate: Date;
  @Column({ type: "timestamp" })
  endDate: Date;
  @Column({ type: "boolean", default: false })
  paymentStatus: boolean;
  @Column()
  vendorId: string;
  @ManyToOne(() => Vendor, (vendor) => vendor.subscriptions)
  vendor: Relation<Vendor>;
  @OneToOne(() => Payment, (payment) => payment.subscription)
  payment: Relation<Payment>;
}
