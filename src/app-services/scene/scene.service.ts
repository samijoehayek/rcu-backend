import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { SceneRequest } from "../../dtos/request/scene.request";
import { SceneResponse } from "../../dtos/response/scene.reponse";
import { SCENE_REPOSITORY } from "../../repositories/scene/scene.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ILike } from "typeorm";

@Service()
export class SceneService {
  @Inject(SCENE_REPOSITORY)
  protected sceneRepository: SCENE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getScene(filter?: any): Promise<Array<SceneResponse>> {
    const scene = filter ? await this.sceneRepository.find(filter) : await this.sceneRepository.find();
    if (!scene) return [];
    return scene;
  }

  public async createScene(payload: SceneRequest): Promise<SceneResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.sceneRepository.save({ ...payload });
  }

  public async updateScene(id: string, payload: SceneRequest): Promise<SceneResponse> {
    const scene = await this.sceneRepository.findOne({ where: { id: id } });
    if (!scene) throw new NotFound("Scene not found");

    id = id.toLowerCase();
    await this.sceneRepository.update({ id: id }, { ...payload });

    return scene;
  }

  public async deleteScene(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const scene = await this.sceneRepository.findOne({ where: { id: id } });
    if (!scene) throw new NotFound("Scene not found");

    await this.sceneRepository.remove(scene);
    return true;
  }

  public async searchSceneByName(search: string): Promise<Array<SceneResponse>> {
    const scene = await this.sceneRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!scene) return [];
    return scene;
  }
}
