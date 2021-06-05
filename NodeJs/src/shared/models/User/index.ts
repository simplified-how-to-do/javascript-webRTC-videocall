import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from "typeorm";
import File from "@models/File";
import bcrypt from "bcryptjs";
import { IUserSessionField } from "./entityUtils/interfaces";
import authConfig from "@config/authConfig";
import { sign } from "jsonwebtoken";

@Entity("User")
class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  avatarId?: string;

  @ManyToOne(() => File)
  @JoinColumn({ name: "avatarId" })
  avatar?: File;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password?: string;

  @Column()
  birthday?: string;

  @Column()
  nationalId?: string;

  @Column({ type: "json" })
  sessionData: IUserSessionField;

  @CreateDateColumn({ update: false })
  readonly createdAt: Date;

  @UpdateDateColumn({ update: false })
  readonly updatedAt: Date;

  @DeleteDateColumn({ update: false })
  readonly deletedAt: Date;

  @AfterLoad()
  private loadPassword() {
    Object.defineProperty(this, "_loadedPassword", {
      value: this.password,
      writable: false,
      configurable: true,
      enumerable: false,
    });
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    const loadedPassword = Object.getOwnPropertyDescriptor(this, "_loadedPassword")?.value;
    if (this.password && this.password !== loadedPassword) {
      this.password = await bcrypt.hash(this.password, 8);
    }
  }

  updateSession() {
    const loginDate = new Date().getTime();

    const token = sign({ loginDate }, authConfig.secretKey, { subject: this.id });

    this.sessionData = { loginDate, token };
  }
}

export default User;
