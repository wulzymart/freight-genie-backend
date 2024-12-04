import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Trip} from "./trips.entity.js";

@Entity()
export class TripHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    info: string;
    @ManyToOne(() => Staff, (staff) => staff.tripActions)
    performedBy: Relation<Staff>;
    @Column()
    performedById: string;
    @ManyToOne(() => Trip, (trip) => trip.history, {nullable: true})
    trip: Relation<Trip>;
    @CreateDateColumn()
    createdAt: Date;
}
