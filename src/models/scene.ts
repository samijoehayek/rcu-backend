import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
  } from 'typeorm';
  import { Collectable } from './collectable';
  import { UserSceneProgress } from './userSceneProgress';
  
  @Entity('scenes')
  export class Scene {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    name: string;
  
    @Column()
    totalCollectables: number;
  
    @OneToMany(() => Collectable, collectable => collectable.scene)
    collectables: Collectable[];
  
    @OneToMany(() => UserSceneProgress, progress => progress.scene)
    userProgress: UserSceneProgress[];
  }