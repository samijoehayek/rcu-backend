import { Controller, Inject } from "@tsed/di";
import { Tags, Get, Returns, Post, Put, Delete } from "@tsed/schema";
import { Authenticate } from "@tsed/passport";
import { PuzzleResponse } from "../../../dtos/response/puzzle.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { PuzzleService } from "../../../app-services/puzzle/puzzle.service";
import { PuzzleRequest } from "../../../dtos/request/puzzle.request";

@Controller("/puzzle")
@Tags("puzzle")
export class PuzzleController {
  @Inject(PuzzleService)
  protected service: PuzzleService;

  @Get("/")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(PuzzleResponse))
  public async getPuzzle(
    @QueryParams("filter") filter?: string
  ): Promise<PuzzleResponse[]> {
    try {
      return filter
        ? await this.service.getPuzzle(JSON.parse(filter))
        : await this.service.getPuzzle();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/")
  @Authenticate("admin-passport")
  @Returns(200, PuzzleResponse)
  public async createPuzzle(
    @BodyParams() puzzle: PuzzleRequest
  ): Promise<PuzzleResponse> {
    try {
      return await this.service.createPuzzle(puzzle);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/:id")
  @Authenticate("admin-passport")
  @Returns(200, PuzzleResponse)
  public async updatePuzzle(
    @PathParams("id") id: string,
    @BodyParams() puzzle: PuzzleRequest
  ): Promise<PuzzleResponse> {
    try {
      return await this.service.updatePuzzle(id, puzzle);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async deletePuzzle(
    @PathParams("id") id: string
  ): Promise<boolean> {
    try {
      return await this.service.deletePuzzle(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/searchPuzzleByName")
  @Authenticate("user-passport")
  @(Returns(200, Array).Of(PuzzleResponse))
  public async searchPuzzle(
    @QueryParams("search") search: string
  ): Promise<PuzzleResponse[]> {
    try {
      return await this.service.searchPuzzleByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
