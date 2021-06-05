import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import PermissionGroup from "../PermissionGroup";
import Role from "../Role";

@Entity("Permission")
class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  routeName: string;

  @Column()
  secret?: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => PermissionGroup)
  @JoinColumn({ name: "permissionGroupId" })
  permissionGroup?: PermissionGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default Permission;
