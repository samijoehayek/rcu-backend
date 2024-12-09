import { Inject, Service } from "@tsed/di";
import { USER_WEARABLE_REPOSITORY } from "../../repositories/userWearable/userWearable.repository";
import { NotFound } from "@tsed/exceptions";
import { UserWearableRequest } from "../../dtos/request/userWearable.request";
import { UserWearableResponse } from "../../dtos/response/userWearable.response";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { UserResponse } from "../../dtos/response/user.response";
import { WEARABLE_REPOSITORY } from "../../repositories/wearable/wearable.repository";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";

@Service()
export class UserWearableService {
  @Inject(USER_WEARABLE_REPOSITORY)
  protected userWearableRepository: USER_WEARABLE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Inject(WEARABLE_REPOSITORY)
  protected wearableRepository: WEARABLE_REPOSITORY;

  @Inject(AVATAR_REPOSITORY)
  protected avatarRepository: AVATAR_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserWearable(
    filter?: any
  ): Promise<Array<UserWearableResponse>> {
    const userWearable = filter
      ? await this.userWearableRepository.find(filter)
      : await this.userWearableRepository.find();
    return userWearable;
  }

  public async createUserWearable(
    payload: UserWearableRequest
  ): Promise<UserWearableResponse> {
    return await this.userWearableRepository.save({ ...payload });
  }

  public async updateUserWearable(
    id: string,
    payload: UserWearableRequest
  ): Promise<UserWearableResponse> {
    const userWearable = await this.userWearableRepository.findOne({
      where: { id: id },
    });
    if (!userWearable) throw new NotFound("UserWearable not found");

    id = id.toLowerCase();
    await this.userWearableRepository.update({ id: id }, { ...payload });

    return userWearable;
  }

  public async deleteUserWearable(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const userWearable = await this.userWearableRepository.findOne({
      where: { id: id },
    });
    if (!userWearable) throw new NotFound("UserWearable not found");

    await this.userWearableRepository.remove(userWearable);
    return true;
  }

  // Function to buy wearable for user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async buyWearable(
    wearableId: string,
    userId: string,
    jwtPayload: any
  ): Promise<UserResponse> {
    // Check if the user is found
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Check if the user logged in is buyin new wearable for himself
    const user_Id = await this.repository.findOne({
      where: { id: jwtPayload.sub },
    });
    if (userId != user_Id?.id)
      throw new Error("User not authorized to buy wearable for another user");

    // Check if the wearable is found
    const wearable = await this.wearableRepository.findOne({ where: { id: wearableId } });
    if (!wearable) throw new Error("Collectable not found");

    // Check if the wearable is available for the user avatar
    if (wearable.avatarId != user.avatarId)
      throw new Error("Wearable is not available for user avatar");

    // Check if the user already has the wearable
    const userWearable = await this.userWearableRepository.findOne({
      where: { wearableId: wearableId, userId: userId },
    });
    if (userWearable) throw new Error("User already has the wearable");

    // Check if the user has enough balance to buy the wearable
    if (user.balance < wearable.price)
      throw new Error("User does not have enough balance to buy this wearable");

    // Deduct balance from user account with the value of the wearable
    user.balance = user.balance - wearable.price;

    // Add wearable to user wearable
    await this.userWearableRepository.save({ wearableId: wearableId, userId: userId });

    // Save the user with the new balance
    await this.repository.save(user);

    // Get new user wearable
    const newUserWearable = await this.userWearableRepository.findOne({
      where: { wearableId: wearableId, userId: userId },
    });
    if (!newUserWearable) throw new Error("User wearable not found");

    return user;
  }

  // Function to set user wearable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setWearable(
    wearableId: string,
    userId: string,
    jwtPayload: any
  ): Promise<UserResponse> {
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const user_Id = await this.repository.findOne({
      where: { id: jwtPayload.sub },
    });
    if (userId != user_Id?.id)
      throw new Error("User not authorized to set wearable for another user");

    const avatar = await this.avatarRepository.findOne({
      where: { id: user.avatarId },
    });
    if (!avatar) throw new Error("Avatar not found");

    const wearable = await this.wearableRepository.findOne({ where: { id: wearableId } });
    if (!wearable) throw new Error("Wearable not found");

    if (wearable.avatarId != avatar.id)
      throw new Error("Wearable is not available for user avatar");

    if (wearable.type === "head") user.head = wearableId;
    if (wearable.type === "torso") user.torso = wearableId;
    if (wearable.type === "legs") user.legs = wearableId;
    if (wearable.type === "feet") user.feet = wearableId;
    if (wearable.type === "hands") user.hands = wearableId;
    if (wearable.type === "ears") user.ears = wearableId;
    if (wearable.type === "upperface") user.upperface = wearableId;
    if (wearable.type === "lowerface") user.lowerface = wearableId;

    await this.repository.save(user);
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async removeWearable(
    wearableId: string,
    userId: string,
    jwtPayload: any
  ): Promise<UserResponse> {
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const user_Id = await this.repository.findOne({
      where: { id: jwtPayload.sub },
    });
    if (userId != user_Id?.id)
      throw new Error("User not authorized to set wearable for another user");

    const avatar = await this.avatarRepository.findOne({
      where: { id: user.avatarId },
    });
    if (!avatar) throw new Error("Avatar not found");

    const wearable = await this.wearableRepository.findOne({ where: { id: wearableId } });
    if (!wearable) throw new Error("Wearable not found");

    if (wearable.avatarId != avatar.id)
      throw new Error("Wearable is not available for user avatar");

    if (wearable.type === "head") user.head = "";
    if (wearable.type === "torso") user.torso = "";
    if (wearable.type === "legs") user.legs = "";
    if (wearable.type === "feet") user.feet = "";
    if (wearable.type === "hands") user.hands = "";
    if (wearable.type === "ears") user.ears = "";
    if (wearable.type === "upperface") user.upperface = "";
    if (wearable.type === "lowerface") user.lowerface = "";

    await this.repository.save(user);
    return user;
  }
}
