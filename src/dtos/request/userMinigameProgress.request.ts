import { Property } from "@tsed/schema";

export class UserMinigameProgressRequest {
  @Property()
  id?: string;

  @Property()
  userId: string;

  @Property()
  minigameId: string;
  
  @Property()
  minigamePieces: string[];

  @Property()
  isMinigameCompleted: boolean;
}
