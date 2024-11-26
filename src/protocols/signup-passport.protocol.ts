import { BodyParams, Req } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Conflict, NotAcceptable } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import * as jwt from "jsonwebtoken";
import { Strategy } from "passport-local";
import { AuthService } from "../app-services/auth/auth.service";
import { EncryptionService } from "../app-services/encryption/encryption.service";
import { envs } from "../config/envs/index";
import { UserRequest } from "../dtos/request/user.request";
import { USER_REPOSITORY } from "../repositories/user/user.repository";

@Protocol({
  name: "signup-passport",
  useStrategy: Strategy,
  settings: {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }
})
export class SignupPassportProtocol implements OnVerify {
  @Inject(AuthService)
  protected service: AuthService;

  @Inject(USER_REPOSITORY)
  userRespository: USER_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  async $onVerify(@Req() req: Req, @BodyParams() payload: UserRequest) {
    if (!payload.email || !payload.password) throw new NotAcceptable("Email and password are required");

    // Validate email format using class-validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(payload.email)) {
        throw new NotAcceptable("Invalid email format");
    }

    const found = await this.userRespository.findOne({
      where: [{ email: payload.email?.toLowerCase() }, { username: payload.username }]
    });
    if (found) throw new Conflict("Email or username already exists");

    const user = await this.service.signup(payload);

    const token = jwt.sign(
      {
        iss: envs.JWT_ISSUER,
        aud: envs.JWT_AUDIENCE,
        sub: user.id,
        exp: Date.now() + Number(envs.JWT_EXPIRATION_AGE) * 1000
      },
      envs.JWT_KEY as string
    );
    return (req.user = { token, user });
  }
}
