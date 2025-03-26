import { Scene } from "../../models/scene";
import { User } from "../../models/user";
import { SceneCompletion } from "../../models/sceneCompletion";
import { Property } from "@tsed/schema";

export class SceneCompletionResponse implements SceneCompletion {

  @Property()
  public id: string;

  @Property()
  public userId: string;

  @Property()
  public sceneId: string;

  @Property()
  public user: User;

  @Property()
  public scene: Scene;

  @Property()
  public startTime: Date;
  
  @Property()
  public endTime: Date;
}
