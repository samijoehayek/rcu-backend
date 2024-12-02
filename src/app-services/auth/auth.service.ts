import { Inject, Service } from "@tsed/di";
import { UserResponse } from "../../dtos/response/user.response";
import { UserRequest } from "../../dtos/request/user.request";
import { EncryptionService } from "../encryption/encryption.service";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ROLE_REPOSITORY } from "../../repositories/role/role.repository";
@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(ROLE_REPOSITORY)
  protected roleRepository: ROLE_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  public async signup(payload: UserRequest): Promise<UserResponse> {
    // Check if user created email and password
    if (payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptPassword = this.encryptionService.encryptMD5(
        payload.email + payload.password
      );
      payload.password = encryptPassword;
    } else {
      throw new Error("Email and password are required");
    }

    // If user did not choose a role, default to user
    if (!payload.roleId) {
      // Get the role id for normal user
      const role = await this.roleRepository.findOne({ where: { roleName: "user" } });
      payload.roleId = role?.id;
    } else {
      const roleObject = await this.roleRepository.findOne({ where: { id: payload.roleId } });
      // Check if the user chose a role of admin
      if (roleObject?.roleName.toLowerCase() === "admin") {
        throw new Error("You cannot create an admin account");
      }
    }

    // save the user
    const user = await this.userRepository.save({ ...payload });

    return user;
  }
}
