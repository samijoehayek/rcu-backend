import { Property } from "@tsed/schema";

export class UserResponse {
    @Property()
    id: string;

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