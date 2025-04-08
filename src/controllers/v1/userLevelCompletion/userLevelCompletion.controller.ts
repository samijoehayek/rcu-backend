import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import { UserLevelCompletionResponse } from "../../../dtos/response/userLevelCompletion.response";
import { UserLevelCompletionRequest } from "../../../dtos/request/userLevelCompletion.request";
import { UserLevelCompletionService } from "../../../app-services/userLevelCompletion/userLevelCompletion.service";
import { Req } from "@tsed/common";

@Controller("/user-level-completion")
export class UserLevelCompletionController {
  @Inject(UserLevelCompletionService)
  protected service: UserLevelCompletionService;

  @Post("/complete-level")
  @Authenticate("user-passport")
  @Returns(200, UserLevelCompletionResponse)
  public async completeLevel(
    @Req() req: any,
    @BodyParams()
    levelData: {
      minigameId: string;
      level: number;
      difficulty: string;
      timeToComplete?: number;
    }
  ): Promise<UserLevelCompletionResponse> {
    try {
      return await this.service.completeLevel(req.user.user.id, levelData);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(UserLevelCompletionResponse))
  public async getUserLevelCompletions(
    @Req() req: any,
    @QueryParams("filter") filter?: string
  ): Promise<UserLevelCompletionResponse[]> {
    try {
      const userId = req.user.user.id;
      return filter
        ? await this.service.getUserLevelCompletions(userId, JSON.parse(filter))
        : await this.service.getUserLevelCompletions(userId);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/stats")
  @Authenticate("user-passport")
  public async getLevelCompletionStats(
    @QueryParams("minigameId") minigameId?: string,
    @QueryParams("level") level?: number,
    @QueryParams("difficulty") difficulty?: string
  ) {
    try {
      return await this.service.getStats({
        minigameId,
        level,
        difficulty,
      });
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, UserLevelCompletionResponse)
  public async createUserLevelCompletion(
    @BodyParams() userLevelCompletion: UserLevelCompletionRequest
  ): Promise<UserLevelCompletionResponse> {
    try {
      return await this.service.createUserLevelCompletion(userLevelCompletion);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, UserLevelCompletionResponse)
  public async updateUserLevelCompletion(
    @PathParams("id") id: string,
    @BodyParams() userLevelCompletion: UserLevelCompletionRequest
  ): Promise<UserLevelCompletionResponse> {
    try {
      return await this.service.updateUserLevelCompletion(id, userLevelCompletion);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteUserLevelCompletion(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.removeUserLevelCompletion(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}