import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Minigame } from "./minigame";

@Entity()
export class UserLevelCompletion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Minigame)
  @JoinColumn({ name: "minigameId" })
  minigame: Minigame;

  @Column()
  minigameId: string;

  @Column()
  level: number;

  @Column()
  difficulty: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  timeToComplete: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  completedAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}