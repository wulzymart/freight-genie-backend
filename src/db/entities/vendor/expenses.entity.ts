import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { Staff } from "./staff.entity.js";

export enum ExpenseStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity()
export class Expense extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  purpose: string;
  @Column({ nullable: true })
  orderId: string;
  @Column({ type: "float" })
  value: number;
  @Column({ default: 0 })
  insurance: number;
  @Column({ type: "float" })
  amount: number;
  @ManyToOne(() => Staff)
  requestedBy: Relation<Staff>;
  @ManyToOne(() => Staff)
  respondedToBy: Relation<Staff>;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
