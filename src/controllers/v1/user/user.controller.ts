import { Controller, Inject } from "@tsed/di";
import { Get, Returns, Tags } from "@tsed/schema";
import { UserResponse } from "../../../dtos/response/user.response";
import { QueryParams } from "@tsed/platform-params";
import { Authenticate } from "@tsed/passport";
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
}
