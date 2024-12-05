import { Property } from "@tsed/schema";
import { Avatar } from "../../models/avatar";
import { User } from "../../models/user";

export class AvatarResponse implements Avatar{

    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    gender: string;

    @Property()
    user: User[];

    @Property()
    userNumber: number;
}