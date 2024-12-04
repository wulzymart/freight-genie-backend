import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm";
import {User} from "./users.entity.js";
import {Customer} from "./customer.entity.js";
import {CorporateCustomerHistory} from "./corporate-customer-history.entity.js";

@Entity()
export class CorporateCustomer extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => User, user => user.customer)
    @JoinColumn()
    userInfo: Relation<User>;
    @OneToOne(() => Customer, customer => customer.corporateCustomer)
    @JoinColumn()
    customerInfo: Relation<Customer>;
    @Column({type: "float", default: 0})
    walletBalance: number;
    @Column()
    businessName: string;
    @Column({type: "simple-json"})
    businessAddress: { stateId: number; address: string };
    @Column({unique: true})
    businessPhone: string;
    @OneToMany(() => CorporateCustomerHistory, history => history.corporateCustomer, {cascade: ['insert', 'update']})
    history: CorporateCustomerHistory[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
