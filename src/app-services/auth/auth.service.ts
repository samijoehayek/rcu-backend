import { Inject, Service } from "@tsed/di";
import { UserResponse } from "../../dtos/response/user.response";
import { UserRequest } from "../../dtos/request/user.request";
import { EncryptionService } from "../encryption/encryption.service";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { v4 as uuidv4 } from "uuid";

@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

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

    // save the user
    const user = await this.userRepository.save({ ...payload });

    return user;
  }
}
