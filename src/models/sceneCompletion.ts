import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Scene } from "./scene";

@Entity()
export class SceneCompletion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Scene) // Only if you have a Phase entity
  @JoinColumn({ name: 'sceneId' })
  scene: Scene;

  @Column()
  sceneId: string;

  @Column({ type: "timestamptz" })
  startTime: Date;

  @Column({ type: "timestamptz", nullable: true })
  endTime: Date;
}
