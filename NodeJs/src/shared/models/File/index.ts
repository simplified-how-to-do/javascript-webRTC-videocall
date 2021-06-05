import {
  Entity,
  AfterLoad,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import appConfig from "@config/appConfig";
import User from "@models/User";

@Entity("File")
class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  originalname: string;

  @Column()
  filename: string;

  @Column()
  ext: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  checkUserPermissions: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  allowedUsers: User[];

  @Column({ default: false })
  checkRoutePermissions: boolean;

  // @ManyToMany(() => User)
  // @JoinTable()
  // allowedRoutes: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  url?: string;

  @AfterLoad()
  private setUrl() {
    this.url = `${appConfig.baseUrl}/files/${this.filename}`;
  }
}

export default File;
