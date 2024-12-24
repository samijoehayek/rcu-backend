import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { WearableService } from "../../../app-services/wearable/wearable.service";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { WearableResponse } from "../../../dtos/response/wearable.response";
import { WearableRequest } from "../../../dtos/request/wearable.request";
import { Authenticate } from "@tsed/passport";

@Controller("/wearable")
@Tags("Wearable")
export class WearableController {
  @Inject(WearableService)
  protected service: WearableService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(WearableResponse))
  public async getWearable(@QueryParams("filter") filter?: string): Promise<WearableResponse[]> {
    try {
      return filter ? await this.service.getWearable(JSON.parse(filter)) : await this.service.getWearable();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, WearableResponse)
  public async createWearable(@BodyParams() wearable: WearableRequest): Promise<WearableResponse> {
    try {
      return await this.service.createWearable(wearable);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, WearableResponse)
  public async updateWearable(@PathParams("id") id: string, @BodyParams() wearable: WearableRequest): Promise<WearableResponse> {
    try {
      return await this.service.updateWearable(id, wearable);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/updateWearablePrice/:id")
  @Authenticate("admin-passport")
  @Returns(200, WearableResponse)
  public async updateWearablePrice(
    @PathParams("id") id: string,
    @BodyParams() wearablePrice: { price: number }
  ): Promise<WearableResponse> {
    try {
      return await this.service.updateWearablePrice(id, wearablePrice.price);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteWearable(@PathParams("id") id: string): Promise<boolean> {
    try {
      return await this.service.removeWearable(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchWearableByName")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(WearableResponse))
  public async searchWearable(@QueryParams("search") search: string): Promise<WearableResponse[]> {
    try {
      return await this.service.searchWearableByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}