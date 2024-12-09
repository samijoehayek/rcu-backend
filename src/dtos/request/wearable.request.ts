import { Property } from "@tsed/schema";

export class WearableRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    price: number;

    @Property()
    type: string;

    @Property()
    avatarId: string;

    @Property()
    createdAt?: string;

    @Property()
    createdBy?: string;

    @Property()
    updatedAt?: string;

    @Property()
    updatedBy?: string;
}