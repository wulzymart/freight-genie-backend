import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { OfficePersonnel } from "./office-staff.entity.js";

export enum ReceiptType {
  ORDER_PAYMENT = "order payment",
  WALLET_REFILL = "wallet refill",
}

@Entity()
export class WalletPayment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  corporateCustomerId: string;
  @Column({ nullable: true })
  orderId: string;
  @Column({ default: 0 })
  vat: number;
  @Column({ default: 0 })
  insurance: number;
  @Column({ type: "float" })
  amount: number;
  @ManyToOne(() => OfficePersonnel)
  processedBy: Relation<OfficePersonnel>;
  get statutory() {
    return this.vat + this.insurance;
  }
  get netPay() {
    return this.amount - (this.vat + this.insurance);
  }
}
