import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserWearable } from "./userWearable";
import { Avatar } from "./avatar";

@Entity()
export class Wearable {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  type: string;

  @Column()
  avatarId!: string;
  @ManyToOne(() => Avatar, (avatar: Avatar) => avatar.id)
  @JoinColumn({ name: "avatarId" })
  avatar: Avatar;

  @OneToMany(() => UserWearable, (userWearable) => userWearable.user)
  userWearable: UserWearable[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  updatedBy!: string;
}
