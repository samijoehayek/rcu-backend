import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role";
import { Avatar } from "./avatar";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  head: string;

  @Column({ nullable: true })
  torso: string;

  @Column({ nullable: true })
  legs: string;

  @Column({ nullable: true })
  feet: string;

  @Column({ nullable: true })
  hands: string;

  @Column({ nullable: true })
  ears: string;

  @Column({ nullable: true })
  upperface: string;

  @Column({ nullable: true })
  lowerface: string;

  // Add foreign key from the avatar table
  @Column({ nullable: true })
  avatarId: string;
  @ManyToOne(() => Avatar, (avatar: Avatar) => avatar.id)
  @JoinColumn({ name: "avatarId" })
  avatar: Avatar;

  // Add foreign key from the roles table
  @Column({ nullable: true })
  roleId: string;
  @ManyToOne(() => Role, (role: Role) => role.id)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Column({ default: 0 })
  balance: number;

  @Column({ nullable: true })
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
