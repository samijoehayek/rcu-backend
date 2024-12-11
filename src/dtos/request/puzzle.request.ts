import { Property } from "@tsed/schema";

export class PuzzleRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    description: string;

    @Property()
    minigameId: string;
}