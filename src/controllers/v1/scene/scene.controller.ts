import { Controller, Inject } from "@tsed/di";
import { Tags, Get, Returns, Post, Put, Delete } from "@tsed/schema";
import { Authenticate } from "@tsed/passport";
import { SceneResponse } from "../../../dtos/response/scene.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { SceneService } from "../../../app-services/scene/scene.service";
import { SceneRequest } from "../../../dtos/request/scene.request";

@Controller("/scene")
@Tags("scene")
export class SceneController {
  @Inject(SceneService)
  protected service: SceneService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(SceneResponse))
  public async getScene(
    @QueryParams("filter") filter?: string
  ): Promise<SceneResponse[]> {
    try {
      return filter
        ? await this.service.getScene(JSON.parse(filter))
        : await this.service.getScene();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, SceneResponse)
  public async createScene(
    @BodyParams() scene: SceneRequest
  ): Promise<SceneResponse> {
    try {
      return await this.service.createScene(scene);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, SceneResponse)
  public async updateScene(
    @PathParams("id") id: string,
    @BodyParams() scene: SceneRequest
  ): Promise<SceneResponse> {
    try {
      return await this.service.updateScene(id, scene);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteScene(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.deleteScene(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchSceneByName")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(SceneResponse))
  public async searchScene(
    @QueryParams("search") search: string
  ): Promise<SceneResponse[]> {
    try {
      return await this.service.searchSceneByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
