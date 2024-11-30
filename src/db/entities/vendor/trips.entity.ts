import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm";
import {Vehicle} from "./vehicles.entity.js";
import {Driver} from "./drivers.entity.js";
import {VehicleAssistant} from "./vehicle-assistant.entity.js";
import {Shipment} from "./shipment.entity.js";
import {Route} from "./routes.entity.js";
import {Station} from "./stations.entity.js";

export enum TripCoverage {
    LASTMAN = "Last-man",
    REGIONAL = "Regional",
    INTRASTATE = "Intrastate",
    INTERSTATE = "Interstate",
}

export enum TripType {
    EXPRESS = "Express",
    REGULAR = "Regular",
}

export enum TripStatus {
    PLANNED = "Planned",
    ONGOING = "Ongoing",
    DELAYED = "Delayed",
    COMPLETED = "Completed",
}

@Entity()
export class Trip extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    code: string
    @Column({type: "enum", enum: TripCoverage})
    coverage: TripCoverage;
    @Column({type: "enum", enum: TripType})
    type: TripType;
    @Column({type: "enum", enum: TripStatus})
    status: TripStatus;
    @Column({type: "boolean", default: false})
    returnTrip: boolean;
    @OneToOne(() => Vehicle)
    @JoinColumn()
    vehicle: Relation<Vehicle>;
    @OneToOne(() => Driver, driver => driver.currentTrip)
    @JoinColumn()
    driver: Relation<Driver>;
    @OneToOne(() => VehicleAssistant, {nullable: true})
    @JoinColumn()
    vehicleAssistant: Relation<VehicleAssistant>;
    @Column()
    vehicleId: string;
    @Column()
    driverId: string;
    @Column({nullable: true})
    vehicleAssistantId: string;
    @OneToMany(() => Shipment, (shipment) => shipment.trip)
    shipments: Relation<Shipment[]>;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @ManyToOne(() => Route, {nullable: true})
    route: Relation<Route>;
    @ManyToOne(() => Station)
    origin: Relation<Station>;
    @Column()
    originId: string;
    @ManyToOne(() => Station, {nullable: true})
    destination?: Relation<Station>;
    @Column({nullable: true})
    destinationId?: string;
    @Column({nullable: true})
    routeId?: number
}
