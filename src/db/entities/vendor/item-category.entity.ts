import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ItemCategory extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column()
  name: string;
  @Column({ type: 'float', nullable: true, default: 1.0 })
  priceFactor: number;
}
