import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Vehicle} from "./vehicles.entity.js";

@Entity()
export class VehicleHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    info: string;
    @ManyToOne(() => Staff, (staff) => staff.vehicleActions, {eager: true})
    performedBy: Relation<Staff>;
    @Column()
    performedById: string;
    @ManyToOne(() => Vehicle, (vehicle) => vehicle.history, {nullable: true})
    vehicle: Relation<Vehicle>;
    @CreateDateColumn()
    createdAt: Date;
}
