import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Scene } from "./scene";
import { User } from "./user";

@Entity()
export class UserSceneProgress {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Scene)
    @JoinColumn({ name: "sceneId" })
    scene: Scene;

    @Column()
    sceneId: string;

    @Column('simple-array')
    collectablesCollected: string[];

    @Column()
    badgeId: string;

    @Column()
    isSceneCompleted: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}