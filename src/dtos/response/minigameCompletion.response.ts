import { Minigame } from "../../models/minigame";
import { User } from "../../models/user";
import { MinigameCompletion } from "../../models/minigameCompletion";
import { Property } from "@tsed/schema";

export class MinigameCompletionResponse implements MinigameCompletion {

  @Property()
  public id: string;

  @Property()
  public userId: string;

  @Property()
  public minigameId: string;

  @Property()
  public user: User;

  @Property()
  public minigame: Minigame;

  @Property()
  public startTime: Date;
  
  @Property()
  public endTime: Date;
}
