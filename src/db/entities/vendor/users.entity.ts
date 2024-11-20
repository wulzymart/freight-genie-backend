import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";

import { compare, genSalt, hash } from "bcrypt";
import { UserRole } from "../../../custom-types/vendor-user-role.types.js";
import { Staff } from "./staff.entity.js";
import { CorporateCustomer } from "./corporate-customer.entity.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column({
    unique: true,
  })
  username: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  pin: string;
  @Column({
    type: "enum",
    enum: UserRole,
  })
  role: UserRole;
  @OneToOne(() => Staff, (staff) => staff.user, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  staff: Relation<Staff>;
  @OneToOne(() => CorporateCustomer, (customer) => customer.userInfo, {
    nullable: true,
    eager: true,
    cascade: true
  })
  customer: Relation<CorporateCustomer>;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  private tempPassword: string;
  private tempPin: string | null;
  async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
  async validatePin(pin: string): Promise<boolean> {
    return await compare(pin, this.pin);
  }
  @AfterLoad()
  loadSecurityCred() {
    this.tempPassword = this.password;
    this.tempPin = this.pin;
  }
  @BeforeInsert() async hashSecureCred(): Promise<void> {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    if (!this.pin) return;
    this.pin = await hash(this.pin, salt);
  }
  @BeforeUpdate()
  async hashUpdatePassword(): Promise<void> {
    const salt = await genSalt();
    if (this.tempPassword !== this.password) {
      this.password = await hash(this.password, salt);
    }
  }
  @BeforeUpdate()
  async hashUpdatePin() {
    const salt = await genSalt();
    if (this.tempPin !== this.pin) {
      this.pin = await hash(this.pin, salt);
    }
  }
}
