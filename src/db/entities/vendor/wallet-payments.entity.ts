import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {OfficePersonnel} from "./office-staff.entity.js";

@Entity()
export class WalletPayment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    corporateCustomerId: string;
    @Column({nullable: true})
    orderId: string;
    @Column({type: 'float'})
    amount: number;
    @ManyToOne(() => OfficePersonnel)
    processedBy: Relation<OfficePersonnel>;
    processedById: string
}
