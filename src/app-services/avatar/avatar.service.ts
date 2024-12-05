import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { AvatarRequest } from "../../dtos/request/avatar.request";
import { AvatarResponse } from "../../dtos/response/avatar.response";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";
import { ILike } from "typeorm";

@Service()
export class AvatarService {
  @Inject(AVATAR_REPOSITORY)
  protected avatarRepository: AVATAR_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAvatar(filter?: any): Promise<Array<AvatarResponse>> {
    // Set filter 'avatarNmae' to lowercase, this is done to avoid confusion
    if (filter?.where.avatarName) filter.where.avatarName = String(filter.where.avatarName).toLowerCase();

    // If filter is provided, use it to find avatar, else find all avatars
    const avatar = filter ? await this.avatarRepository.find(filter) : await this.avatarRepository.find();
    if (!avatar) return [];

    // Return avatar objects in the form of Avatar Response
    return avatar;
  }

  public async searchAvatarByName(search: string): Promise<Array<AvatarResponse>> {
    const avatar = await this.avatarRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!avatar) return [];
    return avatar;
  }

  public async createAvatar(payload: AvatarRequest): Promise<AvatarResponse> {
    // Set avatar name to lowercase, this is done to avoid duplicate avatar names
    if (payload.name) payload.name = String(payload.name).toLowerCase();

    // Check if avatar with this name exists, if it does throw an error
    const avatar = await this.avatarRepository.findOne({ where: { name: payload.name } });
    if (avatar) throw new NotFound("avatar with this name exists");

    // Set avatar id to lowercase
    if (payload.id) payload.id = String(payload.id).toLowerCase();

    // Return the avatar created
    return await this.avatarRepository.save({ ...payload });
  }

  public async updateAvatar(id: string, payload: AvatarRequest): Promise<AvatarResponse> {
    // Make id lowercase in case it is sent with a capital letter
    id = id.toLowerCase();

    // Get the avatar with the given id
    const avatar = await this.avatarRepository.findOne({ where: { id: id } });
    if (!avatar) throw new NotFound("avatar not found");

    // Set avatar name to lowercase, this is done to avoid duplicate avatar names
    if (payload.name) payload.name = String(payload.name).toLowerCase();

    // Update avatar with the avatar payload sent in the form of AvatarRequest
    await this.avatarRepository.update({ id: id }, { ...payload });

    // Return the updated avatar
    return avatar;
  }

  // Function to update user tag in the database
  public async updateAvatarName(avatarId: string, avatarName: string): Promise<AvatarResponse> {
    avatarId = avatarId.toLowerCase();
    const avatar = await this.avatarRepository.findOne({ where: { id: avatarId } });
    if (!avatar) throw new Error("User not found");

    // Check if the tag being changed exists
    if (avatar.name === avatarName) throw new Error("Avatar Name is already set to " + avatarName);
    avatar.name = avatarName;

    await this.avatarRepository.update({ id: avatarId }, { ...avatar });
    return avatar;
  }

  public async removeAvatar(id: string): Promise<boolean> {
    // Make id lowercase in case it is sent with a capital letter
    id = id.toLowerCase();

    // Get the avatar with the given id
    const avatar = await this.avatarRepository.findOne({ where: { id: id } });
    if (!avatar) throw new NotFound("avatar not found");

    // Remove the avatar
    await this.avatarRepository.remove(avatar);

    // Return true if avatar is removed
    return true;
  }
}
