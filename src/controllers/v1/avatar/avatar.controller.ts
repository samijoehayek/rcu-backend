import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { AvatarService } from "../../../app-services/avatar/avatar.service";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { AvatarResponse } from "../../../dtos/response/avatar.response";
import { AvatarRequest } from "../../../dtos/request/avatar.request";
import { Authenticate } from "@tsed/passport";

@Controller("/avatar")
@Tags("Avatar")
export class AvatarController {
  @Inject(AvatarService)
  protected service: AvatarService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(AvatarResponse))
  public async getAvatar(@QueryParams("filter") filter?: string): Promise<AvatarResponse[]> {
    try {
      return filter ? await this.service.getAvatar(JSON.parse(filter)) : await this.service.getAvatar();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, AvatarResponse)
  public async createAvatar(@BodyParams() avatar: AvatarRequest): Promise<AvatarResponse> {
    try {
      return await this.service.createAvatar(avatar);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, AvatarResponse)
  public async updateAvatar(@PathParams("id") id: string, @BodyParams() avatar: AvatarRequest): Promise<AvatarResponse> {
    try {
      return await this.service.updateAvatar(id, avatar);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/updateAvatarName/:id")
  @Authenticate("admin-passport")
  @Returns(200, AvatarResponse)
  public async updateAvatarName(@PathParams("id") avatarId: string, @BodyParams() avatarName: { name: string }): Promise<AvatarResponse> {
    try {
      return await this.service.updateAvatarName(avatarId, avatarName.name);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteAvatar(@PathParams("id") id: string): Promise<boolean> {
    try {
      return await this.service.removeAvatar(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchAvatarByName")
  @(Returns(200, Array).Of(AvatarResponse))
  public async searchAvatar(@QueryParams("search") search: string): Promise<AvatarResponse[]> {
    try {
      return await this.service.searchAvatarByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
