import { Property } from '@tsed/schema';

export class UserWearableRequest {
    @Property()
    id?: string;

    @Property()
    userId: string;

    @Property()
    wearableId: string;

    @Property()
    createdAt?: string;

    @Property()
    updatedAt?: string;
}