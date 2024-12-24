import { Controller, Inject } from "@tsed/di";
import { Tags, Get, Returns, Post, Put, Delete } from "@tsed/schema";
import { Authenticate } from "@tsed/passport";
import { MinigameResponse } from "../../../dtos/response/minigame.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { MinigameService } from "../../../app-services/minigame/minigame.service";
import { MinigameRequest } from "../../../dtos/request/minigame.request";

@Controller("/minigame")
@Tags("minigame")
export class MinigameController {
  @Inject(MinigameService)
  protected service: MinigameService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(MinigameResponse))
  public async getMinigame(
    @QueryParams("filter") filter?: string
  ): Promise<MinigameResponse[]> {
    try {
      return filter
        ? await this.service.getMinigame(JSON.parse(filter))
        : await this.service.getMinigame();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, MinigameResponse)
  public async createMinigame(
    @BodyParams() minigame: MinigameRequest
  ): Promise<MinigameResponse> {
    try {
      return await this.service.createMinigame(minigame);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, MinigameResponse)
  public async updateMinigame(
    @PathParams("id") id: string,
    @BodyParams() minigame: MinigameRequest
  ): Promise<MinigameResponse> {
    try {
      return await this.service.updateMinigame(id, minigame);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteMinigame(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.deleteMinigame(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchMinigameByName")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(MinigameResponse))
  public async searchMinigame(
    @QueryParams("search") search: string
  ): Promise<MinigameResponse[]> {
    try {
      return await this.service.searchMinigameByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
