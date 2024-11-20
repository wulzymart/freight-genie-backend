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
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { OfficePersonnel } from "./office-staff.entity.js";
import { Order } from "./order.entity.js";
import { Driver } from "./drivers.entity.js";
import { VehicleAssistant } from "./vehicle-assistant.entity.js";
import { Vehicle } from "./vehicles.entity.js";
import { StationType } from "../../../custom-types/station-types.js";
import { State } from "./states.entity.js";
import { Lga } from "./lgas.entity.js";

@Entity()
@Unique("location", ["latitude", "longitude"])
@Unique("name", ["name", "nickName"])
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ nullable: true })
  nickName: string;
  @Column({ unique: true })
  code: string;
  @Column({ type: "float" })
  latitude: number;
  @Column({ type: "float" })
  longitude: number;
  @Column()
  stateId: number;
  @ManyToOne(() => State, (state) => state.stations)
  state: Relation<State>;
  @Column()
  lgaId: number;
  @ManyToOne(() => Lga, (lga) => lga.stations, {})
  lga: Relation<Lga>;
  @Column()
  address: string;
  @Column({ type: "enum", default: StationType.LOCAL, enum: StationType })
  type: StationType;
  @OneToMany(() => Station, (station) => station.regionalStation, {
    nullable: true,
  })
  localStations: Relation<Station[]>;
  @ManyToOne(() => Station, (station) => station.localStations, {
    nullable: true,
  })
  regionalStation: Relation<Station> | null;
  @Column({ nullable: true })
  regionalStationId: string;
  @OneToMany(() => OfficePersonnel, (personel) => personel.station)
  officePersonnel: Relation<OfficePersonnel[]>;
  @OneToMany(() => Driver, (driver) => driver.currentStation)
  drivers: Relation<Driver[]>;
  @OneToMany(
    () => VehicleAssistant,
    (vehicleAssistant) => vehicleAssistant.currentStation
  )
  vehicleAssistants: Relation<VehicleAssistant[]>;
  @OneToMany(() => Vehicle, (vehicle) => vehicle.currentStation)
  availableVehicles: Relation<Vehicle[]>;
  @OneToMany(() => Vehicle, (vehicle) => vehicle.registeredTo)
  registeredVehicles: Vehicle[];
  @OneToMany(() => Order, (order) => order.originStation)
  generatedOrders: Relation<Order[]>;
  @OneToMany(() => Order, (order) => order.originStation)
  incomingOrders: Relation<Order[]>;
  @Column({ type: "simple-array" })
  phoneNumbers: string[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
