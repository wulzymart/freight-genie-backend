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
import {TripHistory} from "./trip-history.entity.js";

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
    INTERMEDIATE = "At Intermediate Station",
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
    @Column({type: "enum", enum: TripStatus, default: TripStatus.PLANNED})
    status: TripStatus;
    @Column({type: "boolean", default: false})
    returnTrip: boolean;
    @OneToOne(() => Vehicle)
    @JoinColumn()
    vehicle: Relation<Vehicle>;
    @OneToOne(() => Driver, driver => driver.currentTrip, {cascade: ['update', 'insert']})
    @JoinColumn()
    driver: Relation<Driver>;
    @OneToOne(() => VehicleAssistant, {nullable: true, cascade: ['update', 'insert']})
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
    currentStationId?: string;
    @Column({nullable: true})
    nextStationId?: string
    @Column({nullable: true})
    destinationId?: string;
    @Column({nullable: true})
    routeId?: number
    @Column({type: 'simple-json', nullable: true})
    routingInfo?: any
    @OneToMany(() => TripHistory, (history) => history.trip, {cascade: ['update', 'insert'], onDelete: 'CASCADE'})
    history: Relation<TripHistory[]>
}
