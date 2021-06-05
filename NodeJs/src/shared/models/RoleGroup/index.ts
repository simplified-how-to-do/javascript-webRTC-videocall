import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import Permission from "../Permission";
import Role from "../Role";

@Entity("RoleGroup")
class RoleGroup {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  routeName: string;

  @Column()
  secret?: string;

  @OneToMany(() => Role, (role) => role.roleGroupId)
  @JoinTable()
  roles: Permission[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default RoleGroup;
