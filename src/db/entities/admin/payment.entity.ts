import { AbstractEntity } from "../abstract.entity.js";
import { Column, Entity, ManyToOne, OneToOne, Relation } from "typeorm";
import Vendor from "./vendor.entity.js";
import PaymentType from "../../../custom-types/payment-type.js";
import Subscription from "./subscription.entity.js";

@Entity()
export default class Payment extends AbstractEntity {
  @Column()
  vendorId: string;
  @ManyToOne(() => Vendor, (vendor) => vendor.payments)
  vendor: Relation<Vendor>;
  @OneToOne(() => Subscription, (subscription) => subscription.payment)
  subscription: Relation<Subscription>;
  @Column()
  subscriptionId: string;
  @Column()
  amount: number;
  @Column({ type: "enum", enum: PaymentType })
  paymentType: Relation<PaymentType>;
  @Column()
  receiptInfo: string;
}
