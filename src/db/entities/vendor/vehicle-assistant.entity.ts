import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Staff } from "./staff.entity.js";
import { Station } from "./stations.entity.js";
import { Route } from "./routes.entity.js";
import { OperationEnum, RouteEnum } from "../../../custom-types/field-staff.js";

@Entity()
export class VehicleAssistant extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @OneToOne(() => Staff)
  @JoinColumn()
  staffInfo: Relation<Staff>;
  @ManyToOne(() => Station, (station) => station.vehicleAssistants)
  currentStation: Relation<Station>;
  @Column()
  currentStationId: string;
  @Column({ type: "enum", enum: OperationEnum })
  operation: OperationEnum;
  @Column({ nullable: true, type: "enum", enum: RouteEnum })
  routeType: RouteEnum;
  @ManyToOne(() => Route, (route) => route.vehicleAssistants, {
    nullable: true,
  })
  registeredRoute: Relation<Route>;
  @Column({ nullable: true })
  registeredRouteId: string;
}
