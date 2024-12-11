import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Scene } from "./scene";
import { Puzzle } from "./puzzle";

@Entity()
export class Minigame {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Scene, (scene) => scene.id)
  @JoinColumn({ name: "sceneId" })
  scene: Scene;

  @Column()
  sceneId: string;

  @Column()
  totalMinigamePieces: number;

  @OneToMany(() => Puzzle, (puzzle) => puzzle.minigame)
  puzzle: Puzzle[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
