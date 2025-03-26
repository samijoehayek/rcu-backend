import { Property } from "@tsed/schema";
export class UserRequest {
    @Property()
    id?: string;

    @Property()
    username: string;

    @Property()
    email?: string;

    @Property()
    password: string;

    @Property()
    roleId?: string

    @Property()
    createdAt: Date;

    @Property()
    updatedAt: Date;
}