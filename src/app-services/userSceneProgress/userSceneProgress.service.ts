import { Inject, Service } from "@tsed/di";
import { UserSceneProgressResponse } from "../../dtos/response/userSceneProgress.response";
import { UserSceneProgressRequest } from "../../dtos/request/userSceneProgress.request";
import { USER_SCENE_PROGRESS_REPOSITORY } from "../../repositories/userSceneProgress/userSceneProgress.repository";
import { SCENE_REPOSITORY } from "../../repositories/scene/scene.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class UserSceneProgressService {
  @Inject(USER_SCENE_PROGRESS_REPOSITORY)
  private userSceneProgressRepository: USER_SCENE_PROGRESS_REPOSITORY;

  @Inject(SCENE_REPOSITORY)
  private sceneRepository: SCENE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  private userRepository: USER_REPOSITORY;

  public async collectItem(userId: string, collectItem: {
    sceneId: string;
    collectableId: string;
  }): Promise<UserSceneProgressResponse> {
    // Logic to collect item
    const { sceneId, collectableId } = collectItem;

    // Check if the user is found and the scene is found
    if (!userId || !sceneId) {
      throw new Error("User and scene are required");
    }

    // Check even though the scene and user ids are sent if they are found in the db
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const scene = await this.sceneRepository.findOne({
      where: { id: sceneId },
    });
    if (!user || !scene) {
      throw new Error("User and scene are not found");
    }

    // Check if the collectable is found and from the scene id using the scene table
    const collectable = await this.sceneRepository.findOne({
      where: { id: sceneId, collectables: { id: collectableId } },
    });
    if (!collectable) {
      throw new Error("Collectable not found in scene");
    }

    // Find or create user scene progress
    const userSceneProgress = await this.userSceneProgressRepository.findOne({
      where: { userId, sceneId },
    });
    // If the user is new to the scene create a new user scene progress
    if (!userSceneProgress) {
      const userSceneProgress = this.userSceneProgressRepository.save({
        userId,
        sceneId,
        isSceneCompleted: false,
        collectablesCollected: [collectableId],
      });

      return userSceneProgress;
    } else {
      // Add collectable if not already collected
      if (!userSceneProgress.collectablesCollected.includes(collectableId)) {
        userSceneProgress.collectablesCollected.push(collectableId);
      }
      // Check if scene is completed
      const completedScene = await this.sceneRepository.findOne({
        where: { id: sceneId },
        relations: ["collectables"],
      });

      if (
        completedScene &&
        userSceneProgress.collectablesCollected.length ===
          completedScene.collectables.length
      ) {
        userSceneProgress.isSceneCompleted = true;
      }

      const newUserSceneProgress = await this.userSceneProgressRepository.save(
        userSceneProgress
      );
      return newUserSceneProgress;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserSceneProgress(
    filter?: any
  ): Promise<Array<UserSceneProgressResponse>> {
    const userSceneProgress = filter
      ? await this.userSceneProgressRepository.find(filter)
      : await this.userSceneProgressRepository.find();
    return userSceneProgress;
  }

  public async createUserSceneProgress(
    payload: UserSceneProgressRequest
  ): Promise<UserSceneProgressResponse> {
    return await this.userSceneProgressRepository.save({ ...payload });
  }

  public async updateUserSceneProgress(
    id: string,
    payload: UserSceneProgressRequest
  ): Promise<UserSceneProgressResponse> {
    const userSceneProgress = await this.userSceneProgressRepository.findOne({
      where: { id: id },
    });
    if (!userSceneProgress) throw new NotFound("UserCollectable not found");

    id = id.toLowerCase();
    await this.userSceneProgressRepository.update({ id: id }, { ...payload });

    return userSceneProgress;
  }

  public async removeUserSceneProgress(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const userSceneProgress = await this.userSceneProgressRepository.findOne({
      where: { id: id },
    });
    if (!userSceneProgress) throw new NotFound("UserCollectable not found");

    await this.userSceneProgressRepository.remove(userSceneProgress);
    return true;
  }
}
