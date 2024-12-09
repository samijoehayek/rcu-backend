import { Property } from "@tsed/schema";
import { Wearable } from "../../models/wearable";
import { UserWearable } from "../../models/userWearable";
import { AvatarResponse } from "./avatar.response";

export class WearableResponse implements Wearable{    
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    price: number;

    @Property()
    type: string;

    @Property()
    avatarId: string;

    @Property(() => AvatarResponse)
    avatar: AvatarResponse;

    @Property()
    userWearable: UserWearable[];

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}