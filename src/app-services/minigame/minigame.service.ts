import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MinigameRequest } from "../../dtos/request/minigame.request";
import { MinigameResponse } from "../../dtos/response/minigame.response";
import { MINIGAME_REPOSITORY } from "../../repositories/minigame/minigame.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ILike } from "typeorm";

@Service()
export class MinigameService {
  @Inject(MINIGAME_REPOSITORY)
  protected minigameRepository: MINIGAME_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getMinigame(filter?: any): Promise<Array<MinigameResponse>> {
    const minigame = filter ? await this.minigameRepository.find(filter) : await this.minigameRepository.find();
    if (!minigame) return [];
    return minigame;
  }

  public async createMinigame(payload: MinigameRequest): Promise<MinigameResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.minigameRepository.save({ ...payload });
  }

  public async updateMinigame(id: string, payload: MinigameRequest): Promise<MinigameResponse> {
    const minigame = await this.minigameRepository.findOne({ where: { id: id } });
    if (!minigame) throw new NotFound("Minigame not found");

    id = id.toLowerCase();
    await this.minigameRepository.update({ id: id }, { ...payload });

    return minigame;
  }

  public async deleteMinigame(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const minigame = await this.minigameRepository.findOne({ where: { id: id } });
    if (!minigame) throw new NotFound("Minigame not found");

    await this.minigameRepository.remove(minigame);
    return true;
  }

  public async searchMinigameByName(search: string): Promise<Array<MinigameResponse>> {
    const minigame = await this.minigameRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!minigame) return [];
    return minigame;
  }
}
