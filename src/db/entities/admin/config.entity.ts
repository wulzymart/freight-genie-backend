import { AbstractEntity } from "../abstract.entity.js";
import { Column, Entity, OneToOne, Relation } from "typeorm";
import Vendor from "./vendor.entity.js";

@Entity()
export default class VendorConfig extends AbstractEntity {
  @Column({ type: "float" })
  expressFactor: number;
  @Column({ nullable: true })
  hqId: string;

  @Column({ nullable: true })
  customerCareLine: string;

  @Column({ type: "float" })
  vat: number;

  @Column({ type: "float" })
  insuranceFactor: number;

  @Column({ type: "float" })
  ecommerceFactor: number;
  @Column({ type: "float", default: 80 })
  localFactor: number;
  @Column({ type: "float", default: 5000 })
  dim: number;
  @OneToOne(() => Vendor, (vendor) => vendor.config)
  vendor: Relation<Vendor>;
  @Column()
  vendorId: string;
}
