import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Minigame } from "./minigame";

@Entity("puzzle")
export class Puzzle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Minigame, (minigame) => minigame.puzzle)
  @JoinColumn({ name: "minigameId" })
  minigame: Minigame;

  @Column()
  minigameId: string;
}
