import { Property } from "@tsed/schema";
import { Scene } from "../../models/scene";
import { User } from "../../models/user";

export class UserSceneProgress {
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
  collectablesFound: number;
}
