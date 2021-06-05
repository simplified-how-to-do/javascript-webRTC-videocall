import User from "@models/User";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import Permission from "../Permission";
import RoleGroup from "../RoleGroup";

@Entity("Role")
class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  allowedRoutes: User[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  // @OneToMany("RolePermission", (rolePermission) => {
  //   const
  // })
  // @JoinColumn({ name: "roleGroupId" })
  // avatar?: RoleGroup;

  @Column()
  roleGroupId: string;

  @ManyToOne(() => RoleGroup)
  @JoinColumn({ name: "roleGroupId" })
  avatar?: RoleGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default Role;
