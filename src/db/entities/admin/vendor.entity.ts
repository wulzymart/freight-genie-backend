import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from "typeorm";
import VendorConfig from "./config.entity.js";
import Subscription from "./subscription.entity.js";
import Payment from "./payment.entity.js";

import { AbstractEntity } from "../abstract.entity.js";

@Entity()
export default class Vendor extends AbstractEntity {
  @Column()
  companyName: string;
  @Column()
  address: string;
  @Column({ unique: true })
  phoneNumber: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  domainName: string;
  @Column({ nullable: true })
  logo: string;
  @Column({ type: "simple-json", unique: true })
  registration: { registrationBody: string; registrationNumber: string };
  @OneToOne(() => VendorConfig, (config) => config.vendor, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  config: Relation<VendorConfig>;
  @Column({ default: false })
  verified: boolean;
  @Column({ default: false })
  active: boolean;
  @OneToMany(() => Subscription, (subscription) => subscription.vendor, {
    cascade: true,
  })
  subscriptions: Relation<Subscription[]>;
  @OneToMany(() => Payment, (payment) => payment.vendor, { cascade: true })
  payments: Relation<Payment[]>;
}
