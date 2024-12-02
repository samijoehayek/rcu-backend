import { Property } from "@tsed/schema";
import { Scene } from "../../models/scene";

export class CollectableResponse {
    @Property()
    id: string;
    
    @Property()
    name: string;
    
    @Property()
    description: string;
    
    @Property()
    scene: Scene;
}
