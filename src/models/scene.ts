import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Collectable } from "./collectable";
import { UserSceneProgress } from "./userSceneProgress";
import { Badge } from "./badge";

@Entity("scene")
export class Scene {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name: string;

  @Column()
  totalCollectables: number;

  @OneToMany(() => Collectable, (collectable) => collectable.scene)
  collectables: Collectable[];

  @OneToOne(() => Badge, (badge) => badge.scene)
  badge: Badge;

  @OneToMany(() => UserSceneProgress, (progress) => progress.scene)
  userProgress: UserSceneProgress[];
}
