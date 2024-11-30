import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation, Unique,} from "typeorm";
import {Lga} from "./lgas.entity.js";
import {Station} from "./stations.entity.js";

@Entity()
@Unique(["latitude", "longitude"])
export class State extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    name: string;
    @Column()
    code: string;
    @Column({
        type: "float",
    })
    latitude: number;
    @Column({
        type: "float",
    })
    longitude: number;
    @Column()
    capitalCode: string;
    @OneToMany(() => Lga, (lga) => lga.state, {cascade: true})
    lgas: Relation<Lga[]>;
    @OneToMany(() => Station, (station) => station.state)
    stations: Relation<Station[]>;
}
