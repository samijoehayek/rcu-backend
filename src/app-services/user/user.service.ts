import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { UserResponse } from "../../dtos/response/user.response";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";
import { USER_SCENE_PROGRESS_REPOSITORY } from "../../repositories/userSceneProgress/userSceneProgress";

@Service()
export class UserService {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Inject(AVATAR_REPOSITORY)
  protected avatarRepository: AVATAR_REPOSITORY;

  @Inject(USER_SCENE_PROGRESS_REPOSITORY)
  protected userSceneProgressRepository: USER_SCENE_PROGRESS_REPOSITORY;


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
  
  // Function to get number of users on platform
  public async getUserNumber(): Promise<string> {
    const count = await this.repository.count();
    if (!count) return "0";
    return count.toString();
  }

  // Function to set avatar for user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setAvatarForUser(userId: string, avatarId: string, jwtPayload: any): Promise<UserResponse> {
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const user_Id = await this.repository.findOne({ where: { id: jwtPayload.sub } });
    if (userId != user_Id?.id) throw new Error("User not authorized to set avatar for another user");

    const avatarFound = user.avatarId ? true : false;
    if (avatarFound) throw new Error("User already has an avatar");

    const avatar = await this.avatarRepository.findOne({ where: { id: avatarId } });
    if (!avatar) throw new Error("Avatar not found");

    user.avatarId = avatarId;

    // Save new number of avatar users
    avatar.userNumber = avatar.userNumber + 1;
    await this.avatarRepository.save(avatar);

    await this.repository.save(user);
    return user;
  }

  // Function to reset user from the database
  public async resetUser(userId: string): Promise<UserResponse> {
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Delete all collectables for this user
    await this.userSceneProgressRepository.delete({
      userId: userId
    });

    user.balance = 100;
    user.head = "";
    user.torso = "";
    user.legs = "";
    user.feet = "";
    user.hands = "";
    user.ears = "";
    user.upperface = "";
    user.lowerface = "";

    await this.repository.update({ id: userId }, { ...user });
    return user;
  }
}
