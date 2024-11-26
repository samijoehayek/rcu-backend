import { Inject } from "@tsed/di";
import { OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { EncryptionService } from "../app-services/encryption/encryption.service";
import { USER_REPOSITORY } from "../repositories/user/user.repository";
import { BodyParams, Req } from "@tsed/common";
import { envs } from "../config/envs";
import * as jwt from "jsonwebtoken";
import { LoginRequest } from "../dtos/request/auth.request";

@Protocol({
  name: "login-passport",
  useStrategy: Strategy,
  settings: {
    usernameField: "username",
    passwordField: "password"
  }
})
export class LoginPassportProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  userRepository: USER_REPOSITORY;

  @Inject(EncryptionService)
  encryptionService: EncryptionService;

  async $onVerify(@Req() req: Req, @BodyParams() payload: LoginRequest) {
    if (!payload.username || !payload.password) throw new Error("Username and password are required");

    const user = await this.userRepository.findOne({
      where: [{ email: payload.username.toLowerCase() }, { username: payload.username }]
    });

    if (!user) throw new Error("User not found");

    const encryptPassword = this.encryptionService.encryptMD5(user.email + payload.password);
    if (encryptPassword !== user.password) throw new Error("Password is incorrect");

    const token = jwt.sign(
      {
        iss: envs.JWT_ISSUER,
        aud: envs.JWT_AUDIENCE,
        sub: user.id,
        exp: Date.now() + (Number(envs.JWT_EXPIRATION_AGE) * 1000)
      },
      envs.JWT_KEY as string
    );
    return (req.user = { token, user });
  }
}
