import { Controller, Inject } from "@tsed/di";
import { Tags, Get, Returns, Post, Put, Delete } from "@tsed/schema";
import { Authenticate } from "@tsed/passport";
import { BadgeResponse } from "../../../dtos/response/badge.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { BadgeService } from "../../../app-services/badge/badge.service";
import { BadgeRequest } from "../../../dtos/request/badge.request";

@Controller("/badge")
@Tags("badge")
export class BadgeController {
  @Inject(BadgeService)
  protected service: BadgeService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(BadgeResponse))
  public async getBadge(
    @QueryParams("filter") filter?: string
  ): Promise<BadgeResponse[]> {
    try {
      return filter
        ? await this.service.getBadge(JSON.parse(filter))
        : await this.service.getBadge();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, BadgeResponse)
  public async createBadge(
    @BodyParams() badge: BadgeRequest
  ): Promise<BadgeResponse> {
    try {
      return await this.service.createBadge(badge);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, BadgeResponse)
  public async updateBadge(
    @PathParams("id") id: string,
    @BodyParams() badge: BadgeRequest
  ): Promise<BadgeResponse> {
    try {
      return await this.service.updateBadge(id, badge);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteBadge(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.deleteBadge(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchBadgeByName")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(BadgeResponse))
  public async searchAvatar(
    @QueryParams("search") search: string
  ): Promise<BadgeResponse[]> {
    try {
      return await this.service.searchBadgeByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
