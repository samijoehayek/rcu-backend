import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { BadgeRequest } from "../../dtos/request/badge.request";
import { BadgeResponse } from "../../dtos/response/badge.response";
import { BADGE_REPOSITORY } from "../../repositories/badge/badge.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ILike } from "typeorm";

@Service()
export class BadgeService {
  @Inject(BADGE_REPOSITORY)
  protected badgeRepository: BADGE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getBadge(filter?: any): Promise<Array<BadgeResponse>> {
    const badge = filter ? await this.badgeRepository.find(filter) : await this.badgeRepository.find();
    if (!badge) return [];
    return badge;
  }

  public async createBadge(payload: BadgeRequest): Promise<BadgeResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.badgeRepository.save({ ...payload });
  }

  public async updateBadge(id: string, payload: BadgeRequest): Promise<BadgeResponse> {
    const badge = await this.badgeRepository.findOne({ where: { id: id } });
    if (!badge) throw new NotFound("Badge not found");

    id = id.toLowerCase();
    await this.badgeRepository.update({ id: id }, { ...payload });

    return badge;
  }

  public async deleteBadge(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const badge = await this.badgeRepository.findOne({ where: { id: id } });
    if (!badge) throw new NotFound("Badge not found");

    await this.badgeRepository.remove(badge);
    return true;
  }

  public async searchBadgeByName(search: string): Promise<Array<BadgeResponse>> {
    const badge = await this.badgeRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!badge) return [];
    return badge;
  }
}
