import { Property } from "@tsed/schema";

export class MinigameRequest {
  @Property()
  public id: string;

  @Property()
  public name: string;

  @Property()
  public totalMinigamePieces: number;

  @Property()
  public sceneId: string;
}
