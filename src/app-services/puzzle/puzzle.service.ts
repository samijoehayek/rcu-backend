import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { PuzzleRequest } from "../../dtos/request/puzzle.request";
import { PuzzleResponse } from "../../dtos/response/puzzle.response";
import { PUZZLE_REPOSITORY } from "../../repositories/puzzle/puzzle.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ILike } from "typeorm";

@Service()
export class PuzzleService {
  @Inject(PUZZLE_REPOSITORY)
  protected puzzleRepository: PUZZLE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getPuzzle(filter?: any): Promise<Array<PuzzleResponse>> {
    const puzzle = filter ? await this.puzzleRepository.find(filter) : await this.puzzleRepository.find();
    if (!puzzle) return [];
    return puzzle;
  }

  public async createPuzzle(payload: PuzzleRequest): Promise<PuzzleResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.puzzleRepository.save({ ...payload });
  }

  public async updatePuzzle(id: string, payload: PuzzleRequest): Promise<PuzzleResponse> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id: id } });
    if (!puzzle) throw new NotFound("Puzzle not found");

    id = id.toLowerCase();
    await this.puzzleRepository.update({ id: id }, { ...payload });

    return puzzle;
  }

  public async deletePuzzle(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const puzzle = await this.puzzleRepository.findOne({ where: { id: id } });
    if (!puzzle) throw new NotFound("Puzzle not found");

    await this.puzzleRepository.remove(puzzle);
    return true;
  }

  public async searchPuzzleByName(search: string): Promise<Array<PuzzleResponse>> {
    const puzzle = await this.puzzleRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!puzzle) return [];
    return puzzle;
  }
}
