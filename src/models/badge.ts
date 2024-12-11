import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
  } from "typeorm";
  import { Scene } from "./scene";
  
  @Entity("badge")
  export class Badge {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    name: string;
  
    @Column()
    description: string;
  
    @OneToOne(() => Scene, (scene) => scene.badge)
    @JoinColumn({ name: "sceneId" })
    scene: Scene;
  
    @Column()
    sceneId: string;
  }
  