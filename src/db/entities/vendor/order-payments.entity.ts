import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order.entity.js";
export enum PaymentType {
  CASH = "cash",
  CARD = "card",
  WALLET = "wallet",
}
@Entity()
export class OrderPayment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ type: "enum", enum: PaymentType })
  paymentType: PaymentType;
  @OneToOne(() => Order, (order) => order.paymentInfo)
  order: Relation<Order>;
  @Column()
  orderId: string;
  @Column({ nullable: true })
  receiptId: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
