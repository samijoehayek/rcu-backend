import { Property } from "@tsed/schema";

export class UserSceneProgress {
  @Property()
  id?: string;

  @Property()
  userId: string;

  @Property()
  sceneId: string;
  
  @Property()
  collectablesFound: number;
}
