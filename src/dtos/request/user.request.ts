import { Property } from "@tsed/schema";

export class UserRequest {
    @Property()
    id: number;

    @Property()
    username: string;

    @Property()
    email: string;

    @Property()
    password: string;

    @Property()
    createdAt: Date;

    @Property()
    updatedAt: Date;
}