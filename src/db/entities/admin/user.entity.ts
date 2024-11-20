import { AbstractEntity } from "../abstract.entity.js";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import PublicUserRoles from "../../../custom-types/public-user-roles.js";
import * as bcrypt from "bcrypt";
@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: "enum", enum: PublicUserRoles })
  role: PublicUserRoles;
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  @BeforeUpdate()
  async hashUpdatePassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async isValidPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
