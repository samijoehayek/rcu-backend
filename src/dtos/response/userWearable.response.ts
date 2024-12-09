import { Property } from "@tsed/schema";
import { UserResponse } from "./user.response";
import { User } from "../../models/user";
import { Wearable } from "../../models/wearable";
import { WearableResponse } from "./wearable.response";
import { UserWearable } from "../../models/userWearable";

export class UserWearableResponse implements UserWearable{
    @Property()
    id!: string;

    @Property()
    userId: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    wearableId: string;

    @Property(() => WearableResponse)
    wearable: Wearable;

    @Property()
    createdAt: Date;

    @Property()
    updatedAt: Date;
}