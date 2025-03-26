import { Property } from "@tsed/schema";

export class SceneCompletionRequest {
  @Property()
  id: string;
  @Property()
  userId: string;
  @Property()
  minigameId: string;
  @Property()
  startTime: Date;
  @Property()
  endTime: Date;
}
