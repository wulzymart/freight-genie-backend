import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Customer} from "./customer.entity.js";

@Entity()
export class CustomerHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    info: string;
    @ManyToOne(() => Staff, (staff) => staff.customerActions)
    performedBy: Relation<Staff>;
    @Column()
    performedById: string;
    @ManyToOne(() => Customer, (customer) => customer.history, {
        nullable: true,
    })
    customer: Relation<Customer>;
    @CreateDateColumn()
    createdAt: Date;
}
