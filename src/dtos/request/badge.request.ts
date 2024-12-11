import { Property } from "@tsed/schema";

export class BadgeRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    description: string;

    @Property()
    sceneId: string;
}