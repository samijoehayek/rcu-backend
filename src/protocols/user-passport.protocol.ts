import { Inject } from "@tsed/di";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { envs } from "../config/envs";
import { Req } from "@tsed/common";
import { USER_REPOSITORY } from "../repositories/user/user.repository";

@Protocol({
  name: "user-passport",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: envs.JWT_KEY,
    issuer: envs.JWT_ISSUER,
    audience: envs.JWT_AUDIENCE
  }
})
export class UserPassportProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.userRepository.findOne({ where: { id: jwtPayload.sub } });
    if (!user) throw new Error("Invalid token");

    // Check if the token has expired
    const currentTimestamp = Math.floor(Date.now()); // Current time in milliseconds
    if (jwtPayload.exp && jwtPayload.exp < currentTimestamp) {
      throw new Error("Token has expired");
    }
    return (req.user = { token: jwtPayload, user });
  }
}
