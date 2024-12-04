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
import {OfficePersonnel} from "./office-staff.entity.js";
import {VehicleAssistant} from "./vehicle-assistant.entity.js";
import {Driver} from "./drivers.entity.js";
import {StaffRole} from "../../../custom-types/staff-role.types.js";
import {OrderHistory} from "./order-history.entity.js";
import {CorporateCustomerHistory} from "./corporate-customer-history.entity.js";
import {CustomerHistory} from "./customer-history.entity.js";
import {RouteHistory} from "./route-history.entity.js";
import {ShipmentHistory} from "./shipment-history.entity.js";
import {VehicleHistory} from "./vehicle-history.entity.js";
import {TripHistory} from "./trip-history.entity.js";

@Entity()
export class Staff extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => User)
    @JoinColumn()
    user: Relation<User>;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column()
    phoneNumber: string;
    @Column()
    role: StaffRole;
    @OneToOne(() => OfficePersonnel, (personnel) => personnel.staffInfo, {
        nullable: true,
        cascade: true,
    })
    officePersonnelInfo: Relation<OfficePersonnel> | null;

    @OneToOne(() => VehicleAssistant, (personnel) => personnel.staffInfo, {
        nullable: true,
        cascade: true,
    })
    vehicleAssistantInfo: Relation<VehicleAssistant> | null;
    @OneToOne(() => Driver, (personnel) => personnel.staffInfo, {
        nullable: true,
        cascade: true,
    })
    driverInfo: Relation<Driver> | null;
    @OneToMany(() => OrderHistory, (history) => history.performedBy)
    orderActions: Relation<OrderHistory[]>;
    @OneToMany(() => RouteHistory, (history) => history.performedBy)
    routeActions: Relation<RouteHistory[]>;
    @OneToMany(() => TripHistory, (history) => history.performedBy)
    tripActions: Relation<TripHistory[]>;
    @OneToMany(() => ShipmentHistory, (history) => history.performedBy)
    shipmentActions: Relation<ShipmentHistory[]>;
    @OneToMany(() => CustomerHistory, (history) => history.performedBy)
    customerActions: Relation<CustomerHistory[]>;
    @OneToMany(() => CorporateCustomerHistory, (history) => history.performedBy)
    corporateCustomerActions: Relation<CorporateCustomerHistory[]>;
    @OneToMany(() => VehicleHistory, (history) => history.performedBy)
    vehicleActions: Relation<VehicleHistory[]>;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
