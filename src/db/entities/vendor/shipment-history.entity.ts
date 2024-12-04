import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation,} from "typeorm";
import {Staff} from "./staff.entity.js";
import {Shipment} from "./shipment.entity.js";

@Entity()
export class ShipmentHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    info: string;
    @ManyToOne(() => Staff, (staff) => staff.shipmentActions)
    performedBy: Relation<Staff>;
    @Column()
    performedById: string;
    @ManyToOne(() => Shipment, (shipment) => shipment.history, {nullable: true})
    shipment: Relation<Shipment>;
    @CreateDateColumn()
    createdAt: Date;
}
