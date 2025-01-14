import { Property } from "@tsed/schema";
import { User } from "../../models/user";
import { Minigame } from "../../models/minigame";
import { UserMinigameProgress } from "../../models/userMinigameProgress";

export class UserMinigameProgressResponse implements UserMinigameProgress {
  @Property()
  id: string;

  @Property()
  userId: string;

  @Property()
  user: User;

  @Property()
  minigameId: string;

  @Property()
  minigame: Minigame;

  @Property()
  minigamePieces: string[];

  @Property()
  minigamePiecesPlaced: string[];

  @Property()
  isMinigameCompleted: boolean;

  @Property()
  createdAt: Date;

  @Property()
  updatedAt: Date;
}
