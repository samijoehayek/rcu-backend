import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class UserPasswordVerification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  verificationToken!: string;

  // Add foreign key from the roles table
  @Column()
  userId: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ default: false })
  passwordChanged: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  expiresAt: Date;
}
