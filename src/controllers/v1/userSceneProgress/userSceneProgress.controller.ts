import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import { UserSceneProgressResponse } from "../../../dtos/response/userSceneProgress.response";
import { UserSceneProgressRequest } from "../../../dtos/request/userSceneProgress.request";
import { UserSceneProgressService } from "../../../app-services/userSceneProgress/userSceneProgress.service";
import { Req } from "@tsed/common";

@Controller("/user-scene-progress")
export class UserSceneProgressController {
  @Inject(UserSceneProgressService)
  protected service: UserSceneProgressService;

  @Post("/collect-item")
  @Authenticate("user-passport")
  @Returns(200, UserSceneProgressResponse)
  public async collectItem(
    @Req() req: any,
    @BodyParams()
    collectItem: {
      sceneId: string;
      collectableId: string;
    }
  ): Promise<UserSceneProgressResponse> {
    try {
      return await this.service.collectItem(req.user.user.id, collectItem);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(UserSceneProgressResponse))
  public async getUserSceneProgress(
    @QueryParams("filter") filter?: string
  ): Promise<UserSceneProgressResponse[]> {
    try {
      return filter
        ? await this.service.getUserSceneProgress(JSON.parse(filter))
        : await this.service.getUserSceneProgress();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, UserSceneProgressResponse)
  public async createUserSceneProgress(
    @BodyParams() userSceneProgress: UserSceneProgressRequest
  ): Promise<UserSceneProgressResponse> {
    try {
      return await this.service.createUserSceneProgress(userSceneProgress);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, UserSceneProgressResponse)
  public async updateUserSceneProgress(
    @PathParams("id") id: string,
    @BodyParams() userSceneProgress: UserSceneProgressRequest
  ): Promise<UserSceneProgressResponse> {
    try {
      return await this.service.updateUserSceneProgress(id, userSceneProgress);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteUserSceneProgress(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.removeUserSceneProgress(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
