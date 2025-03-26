import { Controller, Inject } from "@tsed/di";
import { Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { AuthService } from "../../../app-services/auth/auth.service";
import { Authenticate } from "@tsed/passport";
import { AuthResponse } from "../../../dtos/response/auth.response";
import { BodyParams, Req, Res } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { LoginRequest } from "../../../dtos/request/auth.request";

@Controller("/auth")
@Tags("Auth")
export class AuthController {
  @Inject(AuthService)
  protected service: AuthService;

  @Post("/signup")
  @Authenticate("signup-passport")
  @Returns(200, AuthResponse)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public async signup(@Req() req: any, @Res() res: any): Promise<AuthResponse> {
    try {
      return res.send(req.user);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/signup-batch")
  @Authenticate("admin-passport")
  @Returns(200)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public async signupBatch(): Promise<{ total: number; created: number }> {
    try {
      return await this.service.signupBatch();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/delete-batch")
  @Authenticate("admin-passport")
  @Returns(200)
  public async deleteBatch(): Promise<{ total: number; deleted: number }> {
    try {
      return await this.service.deleteBatch();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  // All users including admins can use this endpoint
  @Post("/login")
  @Authenticate("login-passport")
  @Returns(200, AuthResponse)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public async login(
    @Req() req: any,
    @Res() res: any,
    @BodyParams() user: LoginRequest
  ): Promise<AuthResponse> {
    try {
      return res.send(req.user);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }
}
