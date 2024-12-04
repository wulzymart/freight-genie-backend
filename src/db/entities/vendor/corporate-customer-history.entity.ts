import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {CorporateCustomer} from "./corporate-customer.entity.js";

@Entity()
export class CorporateCustomerHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    info: string;
    @ManyToOne(() => Staff, (staff) => staff.corporateCustomerActions)
    performedBy: Relation<Staff>;
    @Column()
    performedById: string;
    @ManyToOne(() => CorporateCustomer, (customer) => customer.history, {
        nullable: true,
    })
    corporateCustomer: Relation<CorporateCustomer>;
    @CreateDateColumn()
    createdAt: Date;
}
