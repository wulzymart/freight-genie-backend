import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { OfficePersonnel } from "./office-staff.entity.js";
import {Order} from "./order.entity.js";

export enum ReceiptType {
  ORDER_PAYMENT = "order payment",
  WALLET_REFILL = "wallet refill",
}

@Entity()
export class Receipt extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({
    type: "enum",
    enum: ReceiptType,
  })
  receiptType: ReceiptType;
  @Column({type: 'float'})
  amount: number;
  @Column()
  receiptInfo: string
  @Column({nullable: true})
  customerId: string;
  @Column({nullable: true})
  corporateCustomerId: string;
  @Column({ nullable: true })
  orderId: string;
  @ManyToOne(() => OfficePersonnel)
  processedBy: Relation<OfficePersonnel>;
  @CreateDateColumn()
  createdAt: Date;
  async orderPrice(){
    if (!this.orderId) return
    return (await Order.findOneBy({id: this.orderId}))?.price
  }
}
