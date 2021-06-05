import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from "typeorm";
import Permission from "../Permission";

@Entity("PermissionOperation")
class PermissionOperation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  routeName?: string;

  @Column()
  secret?: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  allowedRoutes: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default PermissionOperation;
