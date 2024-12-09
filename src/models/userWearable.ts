import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user";
import { Wearable } from "./wearable";

// This model is used to represent the user wearables of an collectable wearable by a user
@Entity()
export class UserWearable {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;
  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  wearableId!: string;
  @ManyToOne(() => Wearable, (wearable: Wearable) => wearable.id)
  @JoinColumn({ name: "wearableId" })
  wearable: Wearable;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
