import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Minigame } from "./minigame";

@Entity()
export class UserMinigameProgress {
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

  @Column("simple-array")
  minigamePieces: string[];

  @Column({ default: false })
  isMinigameCompleted: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
