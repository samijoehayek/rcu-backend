import { Req } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { envs } from "../config/envs";
import { USER_REPOSITORY } from "../repositories/user/user.repository";
import { ROLE_REPOSITORY } from "../repositories/role/role.repository";

@Protocol({
  name: "admin-passport",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: envs.JWT_KEY,
    issuer: envs.JWT_ISSUER,
    audience: envs.JWT_AUDIENCE
  }
})
export class AdminPassportProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  userRepository: USER_REPOSITORY;

  @Inject(ROLE_REPOSITORY)
  roleRepository: ROLE_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.userRepository.findOne({ where: { id: jwtPayload.sub } });
    if (!user) throw new Error("Invalid token");
    
    const role = await this.roleRepository.findOne({ where: { id: user.roleId } });
    if (!role?.roleName || role.roleName.toLowerCase() !== "admin") throw new Error("User is not Admin");

    // Check if the token has expired
    const currentTimestamp = Math.floor(Date.now()); // Current time in milliseconds
    if (jwtPayload.exp && jwtPayload.exp < currentTimestamp) {
      throw new Error("Token has expired");
    }

    return (req.user = { token: jwtPayload, user });
  }
}
