import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Scene } from "./scene";

@Entity("collectables")
export class Collectable {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Scene, (scene) => scene.collectables)
  @JoinColumn({ name: "sceneId" })
  scene: Scene;

  @Column()
  sceneId: string;
}
