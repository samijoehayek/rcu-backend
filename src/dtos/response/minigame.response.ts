import { Property } from "@tsed/schema";
import { Minigame } from "../../models/minigame";
import { Scene } from "../../models/scene";
import { Puzzle } from "src/models/puzzle";

export class MinigameResponse implements Minigame{
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    description: string;

    @Property()
    scene: Scene;

    @Property()
    sceneId: string;

    @Property()
    totalMinigamePieces: number;

    @Property()
    puzzle: Puzzle[];

    @Property()
    createdAt: Date;

    @Property()
    updatedAt: Date;
}