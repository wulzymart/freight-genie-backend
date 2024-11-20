import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  Relation,
  PrimaryGeneratedColumn,
  UpdateDateColumn, OneToMany,
} from "typeorm";
import { User } from "./users.entity.js";
import { Customer } from "./customer.entity.js";
import {History} from "./history.entity.js";
import {Receipt} from "./receipt.entity.js";

@Entity()
export class CorporateCustomer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @OneToOne(() => User, user => user.customer)
  @JoinColumn()
  userInfo: Relation<User>;
  @OneToOne(() => Customer, customer => customer.corporateCustomer)
  @JoinColumn()
  customerInfo: Relation<Customer>;
  @Column({ type: "float", default: 0 })
  walletBalance: number;
  @Column()
  businessName: string;
  @Column({ type: "simple-json" })
  businessAddress: { stateId: number; address: string };
  @Column({unique: true})
  businessPhone: string;
  @OneToMany(() => History, history => history.corporateCustomer, {nullable: true})
  histories: History[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
