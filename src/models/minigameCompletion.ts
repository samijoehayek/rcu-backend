import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Minigame } from "./minigame";

@Entity()
export class MinigameCompletion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Minigame) // Only if you have a Phase entity
  @JoinColumn({ name: 'minigameId' })
  minigame: Minigame;

  @Column()
  minigameId: string;

  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column({ type: "timestamptz", nullable: true })
  endTime: Date;
}
