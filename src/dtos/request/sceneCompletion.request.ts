import { Property } from "@tsed/schema";

export class SceneCompletionRequest {
  @Property()
  id: string;
  @Property()
  userId: string;
  @Property()
  sceneId: string;
  @Property()
  startTime: Date;
  @Property()
  endTime: Date;
}
