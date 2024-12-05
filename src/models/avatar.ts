import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name: string;

    @Column()
    gender: string;

    @OneToMany(() => User, (user) => user.role)
    user!: User[];

    @Column({ default: 0})
    userNumber: number;
}