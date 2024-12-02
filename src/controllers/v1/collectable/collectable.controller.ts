import { Controller, Inject } from "@tsed/di";
import { Tags, Get, Returns, Post, Put, Delete } from "@tsed/schema";
import { Authenticate } from "@tsed/passport";
import { CollectableResponse } from "../../../dtos/response/collectable.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { CollectableService } from "../../../app-services/collectable/collectable.service";
import { CollectableRequest } from "../../../dtos/request/collectable.request";

@Controller("/collectable")
@Tags("collectable")
export class CollectableController {
  @Inject(CollectableService)
  protected service: CollectableService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(CollectableResponse))
  public async getCollectable(
    @QueryParams("filter") filter?: string
  ): Promise<CollectableResponse[]> {
    try {
      return filter
        ? await this.service.getCollectable(JSON.parse(filter))
        : await this.service.getCollectable();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, CollectableResponse)
  public async createCollectable(
    @BodyParams() collectable: CollectableRequest
  ): Promise<CollectableResponse> {
    try {
      return await this.service.createCollectable(collectable);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, CollectableResponse)
  public async updateCollectable(
    @PathParams("id") id: string,
    @BodyParams() collectable: CollectableRequest
  ): Promise<CollectableResponse> {
    try {
      return await this.service.updateCollectable(id, collectable);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteCollectable(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.deleteCollectable(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchCollectableByName")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(CollectableResponse))
  public async searchAvatar(
    @QueryParams("search") search: string
  ): Promise<CollectableResponse[]> {
    try {
      return await this.service.searchCollectableByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
