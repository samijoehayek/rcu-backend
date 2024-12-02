import { Property } from "@tsed/schema";
import { Scene } from "../../models/scene";
import { Collectable } from "../../models/collectable";
import { UserSceneProgress } from "../../models/userSceneProgress";

export class SceneResponse implements Scene {
    @Property()
    public id: string;
    
    @Property()
    public name: string;
    
    @Property()
    public totalCollectables: number;

    @Property()
    collectables: Collectable[];

    @Property()
    userProgress: UserSceneProgress[];
}