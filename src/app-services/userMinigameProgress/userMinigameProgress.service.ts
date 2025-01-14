import { Inject, Service } from "@tsed/di";
import { UserMinigameProgressResponse } from "../../dtos/response/userMinigameProgress.response";
import { UserMinigameProgressRequest } from "../../dtos/request/userMinigameProgress.request";
import { USER_MINIGAME_PROGRESS_REPOSITORY } from "../../repositories/userMinigameProgress/userMinigameProgress.repository";
import { MINIGAME_REPOSITORY } from "../../repositories/minigame/minigame.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class UserMinigameProgressService {
  @Inject(USER_MINIGAME_PROGRESS_REPOSITORY)
  private userMinigameProgressRepository: USER_MINIGAME_PROGRESS_REPOSITORY;

  @Inject(MINIGAME_REPOSITORY)
  private minigameRepository: MINIGAME_REPOSITORY;

  @Inject(USER_REPOSITORY)
  private userRepository: USER_REPOSITORY;

  public async collectItem(
    userId: string,
    collectItem: {
      minigameId: string;
      puzzlePieceId: string;
    }
  ): Promise<UserMinigameProgressResponse> {
    // Logic to collect item
    const { minigameId, puzzlePieceId } = collectItem;

    // Check if the user is found and the minigame is found
    if (!userId || !minigameId) {
      throw new Error("User and minigame are required");
    }

    // Check even though the minigame and user ids are sent if they are found in the db
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const minigame = await this.minigameRepository.findOne({
      where: { id: minigameId },
    });
    if (!user || !minigame) {
      throw new Error("User and minigame are not found");
    }

    // Check if the collectable is found and from the minigame id using the minigame table
    const puzzlePiece = await this.minigameRepository.findOne({
      where: { id: minigameId, puzzle: { id: puzzlePieceId } },
    });
    if (!puzzlePiece) {
      throw new Error("Puzzle Piece not found in minigame");
    }

    // Find or create user minigame progress
    const userMinigameProgress =
      await this.userMinigameProgressRepository.findOne({
        where: { userId, minigameId },
      });
    // If the user is new to the minigame create a new user minigame progress
    if (!userMinigameProgress) {
      const userMinigameProgress = this.userMinigameProgressRepository.save({
        userId,
        minigameId,
        isMinigameCompleted: false,
        minigamePieces: [puzzlePieceId],
      });

      return userMinigameProgress;
    } else {
      // Add collectable if not already collected
      if (!userMinigameProgress.minigamePieces.includes(puzzlePieceId)) {
        userMinigameProgress.minigamePieces.push(puzzlePieceId);
      }
      // Check if minigame is completed
      const completedMinigame = await this.minigameRepository.findOne({
        where: { id: minigameId },
        relations: ["puzzle"],
      });

      if (
        completedMinigame &&
        userMinigameProgress.minigamePieces.length ===
          completedMinigame.puzzle.length
      ) {
        userMinigameProgress.isMinigameCompleted = true;
      }

      const newUserMinigameProgress =
        await this.userMinigameProgressRepository.save(userMinigameProgress);
      return newUserMinigameProgress;
    }
  }

  public async placeItem(
    userId: string,
    placeItem: {
      minigameId: string;
      puzzlePieceIds: string[];
    }
  ): Promise<UserMinigameProgressResponse> {
    // Logic to place item
    const { minigameId, puzzlePieceIds } = placeItem;

    // Check if the user is found and the minigame is found
    if (!userId || !minigameId) {
      throw new Error("User and minigame are required");
    }

    // Check even though the minigame and user ids are sent if they are found in the db
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const minigame = await this.minigameRepository.findOne({
      where: { id: minigameId },
    });
    if (!user || !minigame) {
      throw new Error("User and minigame are not found");
    }

    // Validate that each puzzle piece belongs to the minigame
    const validPuzzlePieces = [];
    for (const pieceId of puzzlePieceIds) {
      const puzzlePiece = await this.minigameRepository.findOne({
        where: { id: minigameId, puzzle: { id: pieceId } },
      });
      if (puzzlePiece) {
        validPuzzlePieces.push(pieceId);
      }
    }

    if (validPuzzlePieces.length === 0) {
      throw new Error("No valid puzzle pieces found in the minigame");
    }

    // Find or create user minigame progress
    const userMinigameProgress =
      await this.userMinigameProgressRepository.findOne({
        where: { userId, minigameId },
      });

    if (!userMinigameProgress) {
      throw new Error("User minigame progress not found");
    }

    // Add valid pieces to the user's progress, ensuring no duplicates
    const newPieces = validPuzzlePieces.filter(
      (pieceId) => !userMinigameProgress.minigamePiecesPlaced.includes(pieceId)
    );
    userMinigameProgress.minigamePiecesPlaced.push(...newPieces);

    const newUserMinigameProgress =
      await this.userMinigameProgressRepository.save(userMinigameProgress);
    return newUserMinigameProgress;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserMinigameProgress(
    filter?: any
  ): Promise<Array<UserMinigameProgressResponse>> {
    const userMinigameProgress = filter
      ? await this.userMinigameProgressRepository.find(filter)
      : await this.userMinigameProgressRepository.find();
    return userMinigameProgress;
  }

  public async createUserMinigameProgress(
    payload: UserMinigameProgressRequest
  ): Promise<UserMinigameProgressResponse> {
    return await this.userMinigameProgressRepository.save({ ...payload });
  }

  public async updateUserMinigameProgress(
    id: string,
    payload: UserMinigameProgressRequest
  ): Promise<UserMinigameProgressResponse> {
    const userMinigameProgress =
      await this.userMinigameProgressRepository.findOne({
        where: { id: id },
      });
    if (!userMinigameProgress) throw new NotFound("UserCollectable not found");

    id = id.toLowerCase();
    await this.userMinigameProgressRepository.update(
      { id: id },
      { ...payload }
    );

    return userMinigameProgress;
  }

  public async removeUserMinigameProgress(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const userMinigameProgress =
      await this.userMinigameProgressRepository.findOne({
        where: { id: id },
      });
    if (!userMinigameProgress) throw new NotFound("UserCollectable not found");

    await this.userMinigameProgressRepository.remove(userMinigameProgress);
    return true;
  }
}
