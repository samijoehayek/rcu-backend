import { Property } from "@tsed/schema";
import { Scene } from "../../models/scene";
import { Collectable } from "../../models/collectable";
import { UserSceneProgress } from "../../models/userSceneProgress";
import { Badge } from "src/models/badge";

export class SceneResponse implements Scene {
    @Property()
    public id: string;
    
    @Property()
    public name: string;
    
    @Property()
    public totalCollectables: number;

    @Property()
    public collectables: Collectable[];

    @Property()
    public badge: Badge;

    @Property()
    public userProgress: UserSceneProgress[];
}