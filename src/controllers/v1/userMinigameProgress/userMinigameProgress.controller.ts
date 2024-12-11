import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import { UserMinigameProgressResponse } from "../../../dtos/response/userMinigameProgress.response";
import { UserMinigameProgressRequest } from "../../../dtos/request/userMinigameProgress.request";
import { UserMinigameProgressService } from "../../../app-services/userMinigameProgress/userMinigameProgress.service";
import { Req } from "@tsed/common";

@Controller("/user-minigame-progress")
export class UserMinigameProgressController {
  @Inject(UserMinigameProgressService)
  protected service: UserMinigameProgressService;

  @Post("/collect-item")
  @Authenticate("user-passport")
  @Returns(200, UserMinigameProgressResponse)
  public async collectItem(
    @Req() req: any,
    @BodyParams()
    collectItem: {
      minigameId: string;
      puzzlePieceId: string;
    }
  ): Promise<UserMinigameProgressResponse> {
    try {
      return await this.service.collectItem(req.user.user.id, collectItem);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(UserMinigameProgressResponse))
  public async getUserMinigameProgress(
    @QueryParams("filter") filter?: string
  ): Promise<UserMinigameProgressResponse[]> {
    try {
      return filter
        ? await this.service.getUserMinigameProgress(JSON.parse(filter))
        : await this.service.getUserMinigameProgress();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, UserMinigameProgressResponse)
  public async createUserMinigameProgress(
    @BodyParams() userMinigameProgress: UserMinigameProgressRequest
  ): Promise<UserMinigameProgressResponse> {
    try {
      return await this.service.createUserMinigameProgress(userMinigameProgress);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, UserMinigameProgressResponse)
  public async updateUserMinigameProgress(
    @PathParams("id") id: string,
    @BodyParams() userMinigameProgress: UserMinigameProgressRequest
  ): Promise<UserMinigameProgressResponse> {
    try {
      return await this.service.updateUserMinigameProgress(id, userMinigameProgress);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteUserMinigameProgress(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.removeUserMinigameProgress(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
