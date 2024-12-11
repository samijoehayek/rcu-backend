import { Property } from "@tsed/schema";
import { Scene } from "../../models/scene";

export class BadgeResponse {
    @Property()
    id: string;
    
    @Property()
    name: string;
    
    @Property()
    description: string;
    
    @Property()
    scene: Scene;
}
