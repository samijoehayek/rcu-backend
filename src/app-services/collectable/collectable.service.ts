import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { CollectableRequest } from "../../dtos/request/collectable.request";
import { CollectableResponse } from "../../dtos/response/collectable.response";
import { COLLECTABLE_REPOSITORY } from "../../repositories/collectable/collectable.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ILike } from "typeorm";

@Service()
export class CollectableService {
  @Inject(COLLECTABLE_REPOSITORY)
  protected collectableRepository: COLLECTABLE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getCollectable(filter?: any): Promise<Array<CollectableResponse>> {
    const collectable = filter ? await this.collectableRepository.find(filter) : await this.collectableRepository.find();
    if (!collectable) return [];
    return collectable;
  }

  public async createCollectable(payload: CollectableRequest): Promise<CollectableResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.collectableRepository.save({ ...payload });
  }

  public async updateCollectable(id: string, payload: CollectableRequest): Promise<CollectableResponse> {
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    id = id.toLowerCase();
    await this.collectableRepository.update({ id: id }, { ...payload });

    return collectable;
  }

  public async deleteCollectable(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    await this.collectableRepository.remove(collectable);
    return true;
  }

  public async searchCollectableByName(search: string): Promise<Array<CollectableResponse>> {
    const collectable = await this.collectableRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!collectable) return [];
    return collectable;
  }
}
