import { Controller, Inject } from "@tsed/di";
import { Get, Put, Returns, Tags } from "@tsed/schema";
import { UserResponse } from "../../../dtos/response/user.response";
import { PathParams, QueryParams } from "@tsed/platform-params";
import { Arg, Authenticate } from "@tsed/passport";
import { Exception } from "@tsed/exceptions";
import { Req } from "@tsed/common";
import { UserService } from "../../../app-services/user/user.service";

@Controller("/users")
@Tags("users")
export class UserController {
  @Inject(UserService)
  protected service: UserService;

  @Get("/")
  @(Returns(200, Array).Of(UserResponse).Description("Get all users"))
  public async getAllUsers(@QueryParams("filter") filter?: string): Promise<UserResponse[]> {
    try{
      return filter ? await this.service.getUsers(filter) : await this.service.getUsers();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get("/getUserById")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserById(@Req() req: any, @QueryParams("filter") filter?: string): Promise<UserResponse> {
    try {
      return filter
        ? await this.service.getUserById(req.user.user.id, JSON.parse(filter))
        : await this.service.getUserById(req.user.user.id);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/setAvatarForUser/:userId/:avatarId")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async setAvatarForUser(
    @PathParams("userId") userId: string,
    @PathParams("avatarId") avatarId: string,
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.setAvatarForUser(userId, avatarId, jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/getUserCount")
  @Authenticate("admin-passport")
  @Returns(200, String)
  public async getUserCount(): Promise<string> {
    try {
      return await this.service.getUserNumber();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }
}
