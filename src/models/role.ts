import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Role{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({unique:true})
    roleName!: string;

    @Column({nullable:true})
    roleDescription!: string;

    @OneToMany(() => User, (user) => user.role)
    user!: User[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({nullable:true})
    createdBy!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @Column({nullable:true})
    updatedBy!: string;
}