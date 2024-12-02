import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  // Add foreign key from the roles table
  @Column({ nullable: true })
  roleId: string;
  @ManyToOne(() => Role, (role: Role) => role.id)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Column({ nullable: true })
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
