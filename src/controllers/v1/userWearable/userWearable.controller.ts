import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { UserWearableService } from "../../../app-services/userWearable/userWearable.service";
import { UserWearableResponse } from "../../../dtos/response/userWearable.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { UserWearableRequest } from "../../../dtos/request/userWearable.request";
import { Arg, Authenticate } from "@tsed/passport";
import { UserResponse } from "../../../dtos/response/user.response";

@Controller("/userWearable")
@Tags("UserWearable")
export class UserWearableController {
  @Inject(UserWearableService)
  protected service: UserWearableService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(UserWearableResponse))
  public async getUserWearable(
    @QueryParams("filter") filter?: string
  ): Promise<UserWearableResponse[]> {
    try {
      return filter
        ? await this.service.getUserWearable(JSON.parse(filter))
        : await this.service.getUserWearable();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, UserWearableResponse)
  public async createUserWearable(
    @BodyParams() userWearable: UserWearableRequest
  ): Promise<UserWearableResponse> {
    try {
      return await this.service.createUserWearable(userWearable);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, UserWearableResponse)
  public async updateUserWearable(
    @PathParams("id") id: string,
    @BodyParams() userWearable: UserWearableRequest
  ): Promise<UserWearableResponse> {
    try {
      return await this.service.updateUserWearable(id, userWearable);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deleteUserWearable(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.deleteUserWearable(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/buyWearable")
  @Authenticate("user-passport")
  @Returns(200, UserResponse)
  public async buyWearable(
    @BodyParams() buyObject: { wearableId: string; userId: string },
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.buyWearable(
        buyObject.wearableId,
        buyObject.userId,
        jwtPayload
      );
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/setWearable")
  @Authenticate("user-passport")
  @Returns(200, UserResponse)
  public async setUserWearable(
    @BodyParams() wearableObject: { wearableId: string; userId: string },
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.setWearable(
        wearableObject.wearableId,
        wearableObject.userId,
        jwtPayload
      );
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/removeWearable")
  @Authenticate("user-passport")
  @Returns(200, UserResponse)
  public async removeUserWearable(
    @BodyParams() wearableObject: { wearableId: string; userId: string },
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.removeWearable(
        wearableObject.wearableId,
        wearableObject.userId,
        jwtPayload
      );
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }
}
