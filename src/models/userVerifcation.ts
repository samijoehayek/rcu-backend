import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class UserVerification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  verficationToken!: string;

  // Add foreign key from the user table
  @Column()
  userId: string;
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  expiresAt: Date;
}
