import { Property } from "@tsed/schema";
import { Scene } from "../../models/scene";
import { User } from "../../models/user";

export class UserSceneProgressResponse {
  @Property()
  id: string;

  @Property()
  userId: string;

  @Property()
  user: User;

  @Property()
  scene: Scene;

  @Property()
  sceneId: string;

  @Property()
  collectablesCollected: string[];

  @Property()
  isSceneCompleted: boolean;
}
