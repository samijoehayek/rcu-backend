import { Property } from "@tsed/schema";

export class UserSceneProgressRequest {
  @Property()
  id?: string;

  @Property()
  userId: string;

  @Property()
  sceneId: string;
  
  @Property()
  collectablesCollected: string[];

  @Property()
  isSceneCompleted: boolean;
}
