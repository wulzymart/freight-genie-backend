import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExpensePurpose extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ type: 'float', nullable: true, default: 1.0 })
  maxValue: number;
}
