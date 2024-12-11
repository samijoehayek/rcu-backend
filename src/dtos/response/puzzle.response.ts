import { Property } from "@tsed/schema";
import { Minigame } from "../../models/minigame";

export class PuzzleResponse {
    @Property()
    id: string;
    
    @Property()
    name: string;
    
    @Property()
    description: string;
    
    @Property()
    minigame: Minigame;
}
