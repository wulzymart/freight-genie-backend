import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm";
import {Order} from "./order.entity.js";
import {CorporateCustomer} from "./corporate-customer.entity.js";
import {CustomerHistory} from "./customer-history.entity.js";

export enum CustomerType {
    INDIVIDUAL = "individual",
    CORPORATE = "corporate",
}

@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column({
        unique: true,
    })
    phoneNumber: string;
    @Column({nullable: true})
    email: string;
    @Column({type: "simple-json"})
    address: { stateId: number; address: string };
    @Column({
        type: "enum",
        enum: CustomerType,
        default: CustomerType.INDIVIDUAL,
    })
    customerType: CustomerType;
    @OneToOne(() => CorporateCustomer, (corporateCustomer) => corporateCustomer.customerInfo, {
        cascade: true,
        nullable: true,
    })
    corporateCustomer: Relation<CorporateCustomer>;
    @OneToMany(() => Order, (order) => order.customer)
    orders: Relation<Order[]>;
    @OneToMany(() => CustomerHistory, (history) => history.customer, {cascade: ['update', 'insert']})
    history: Relation<CustomerHistory[]>;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
