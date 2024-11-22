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
import { User } from "./users.entity.js";
import { OfficePersonnel } from "./office-staff.entity.js";
import { VehicleAssistant } from "./vehicle-assistant.entity.js";
import { Driver } from "./drivers.entity.js";
import { StaffRole } from "../../../custom-types/staff-role.types.js";
import { History } from "./history.entity.js";

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
    eager: true,
    cascade: true,
  })
  officePersonnelInfo: Relation<OfficePersonnel> | null;

  @OneToOne(() => VehicleAssistant, (personnel) => personnel.staffInfo, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  vehicleAssistantInfo: Relation<VehicleAssistant> | null;
  @OneToOne(() => Driver, (personnel) => personnel.staffInfo, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  driverInfo: Relation<Driver> | null;
  @OneToMany(() => History, (history) => history.performedBy)
  actionsPerformed: Relation<History[]>;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
