import { Property } from "@tsed/schema";

export class UserLevelCompletionResponse {
  @Property()
  id: string;

  @Property()
  userId: string;

  @Property()
  minigameId: string;

  @Property()
  level: number;

  @Property()
  difficulty: string;

  @Property()
  score?: number;

  @Property()
  timeToComplete?: number;

  @Property()
  isCompleted: boolean;

  @Property()
  completedAt: Date;

  @Property()
  createdAt: Date;

  @Property()
  updatedAt: Date;
}