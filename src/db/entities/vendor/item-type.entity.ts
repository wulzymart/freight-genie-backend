import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum TypePricing {
  FIXED = "fixed",
  PER_KG = "per kg",
}
@Entity()
export class ItemType extends BaseEntity {
  @PrimaryGeneratedColumn("identity")
  id: number;
  @Column({ type: "enum", enum: TypePricing, default: TypePricing.FIXED })
  pricing: TypePricing;
  @Column()
  name: string;
  @Column({ type: "float" })
  price: number;
  @Column({ type: "float", nullable: true })
  limit: number;
  @Column({ type: "float", nullable: true })
  min: number;
}
