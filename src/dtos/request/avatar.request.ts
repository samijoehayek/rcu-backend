import { Property } from "@tsed/schema";

export class AvatarRequest {
    @Property()  
    id?: string;

    @Property()  
    name: string;

    @Property()  
    gender: string;
}