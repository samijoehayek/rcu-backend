import { Property } from "@tsed/schema";

export class SceneRequest {
  @Property()
  public id: string;

  @Property()
  public name: string;

  @Property()
  public totalCollectables: number;
}
