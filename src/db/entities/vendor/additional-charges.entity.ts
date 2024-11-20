import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdditionalCharge extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  charge: string;
}
