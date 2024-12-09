import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { WearableRequest } from "../../dtos/request/wearable.request";
import { WearableResponse } from "../../dtos/response/wearable.response";
import { WEARABLE_REPOSITORY } from "../../repositories/wearable/wearable.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { USER_WEARABLE_REPOSITORY } from "../../repositories/userWearable/userWearable.repository";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";
import { ILike } from "typeorm";

@Service()
export class WearableService {
  @Inject(WEARABLE_REPOSITORY)
  protected wearableRepository: WEARABLE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(AVATAR_REPOSITORY)
  protected avatarRepository: AVATAR_REPOSITORY;

  @Inject(USER_WEARABLE_REPOSITORY)
  protected userWearableRepository: USER_WEARABLE_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getWearable(filter?: any): Promise<Array<WearableResponse>> {
    const wearable = filter ? await this.wearableRepository.find(filter) : await this.wearableRepository.find();
    if (!wearable) return [];
    return wearable;
  }

  public async createWearable(payload: WearableRequest): Promise<WearableResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();

    // check if the price is positive
    if (payload.price < 0) throw new NotFound("Price cannot be negative");

    // check if the avatar id exists
    const avatar = await this.avatarRepository.findOne({ where: { id: payload.avatarId } });
    if (!avatar) throw new NotFound("Avatar not found");

    // Make the type lowercase and see if it does match one of the 8 types
    payload.type = payload.type.toLowerCase();
    if (payload.type !== "head" && payload.type !== "torso" && payload.type !== "legs" && payload.type !== "feet" && payload.type !== "hands" && payload.type !== "ears" && payload.type !== "upperface" && payload.type !== "lowerface") {
      throw new NotFound("Type not found");
    }

    return await this.wearableRepository.save({ ...payload });
  }

  public async updateWearable(id: string, payload: WearableRequest): Promise<WearableResponse> {
    const wearable = await this.wearableRepository.findOne({ where: { id: id } });
    if (!wearable) throw new NotFound("Wearable not found");

    id = id.toLowerCase();
    await this.wearableRepository.update({ id: id }, { ...payload });

    return wearable;
  }

  public async updateWearablePrice(id:string, price:number): Promise<WearableResponse> {
    const wearable = await this.wearableRepository.findOne({ where: { id: id } });
    if (!wearable) throw new NotFound("Wearable not found");

    if (wearable.price == price) throw new Error("Wearable price is already set to " + price);

    // Check if the value of the collectable is logical
    if (price < 0) throw new Error("Wearable price can't be negative");
    wearable.price = price;

    await this.wearableRepository.update({ id: id }, { ...wearable });
    return wearable;
  }

  public async removeWearable(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const wearable = await this.wearableRepository.findOne({ where: { id: id } });
    if (!wearable) throw new NotFound("Wearable not found");

    await this.wearableRepository.remove(wearable);
    return true;
  }

  public async searchWearableByName(search: string): Promise<Array<WearableResponse>> {
    const wearable = await this.wearableRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!wearable) return [];
    return wearable;
  }
}
