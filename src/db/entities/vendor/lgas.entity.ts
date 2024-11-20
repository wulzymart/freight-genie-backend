import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from "typeorm";
import { State } from "./states.entity.js";

import { Station } from "./stations.entity.js";

@Entity()
@Unique("lga_in_state", ["stateId", "name"])
export class Lga extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => State, (state) => state.lgas, { eager: false })
  state: Relation<State>;
  @Column()
  stateId: number;
  @OneToMany(() => Station, (station) => station.lga)
  stations: Relation<Station[]>;
}
