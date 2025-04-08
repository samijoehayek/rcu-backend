import { Property, Required } from "@tsed/schema";

export class UserLevelCompletionRequest {
  @Property()
  @Required()
  userId: string;

  @Property()
  @Required()
  minigameId: string;

  @Property()
  @Required()
  level: number;

  @Property()
  @Required()
  difficulty: string;

  @Property()
  score?: number;

  @Property()
  timeToComplete?: number;

  @Property()
  isCompleted: boolean;
}