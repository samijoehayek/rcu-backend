import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { UserResponse } from "../../dtos/response/user.response";

@Service()
export class UserService {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  // Function to get all users from the database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUsers(filter?: any): Promise<Array<UserResponse>> {
    const users = filter
      ? await this.repository.find(filter)
      : await this.repository.find();
    if (!users) return [];
    return users;
  }

  // Function to get user by id from the database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserById(id: string, filter?: any): Promise<UserResponse> {
    id = id.toLowerCase();
    const user = filter
      ? await this.repository.findOne({ where: { id: id }, ...filter })
      : await this.repository.findOne({ where: { id: id } });
    if (!user) return {} as UserResponse;
    return user;
  }
}
