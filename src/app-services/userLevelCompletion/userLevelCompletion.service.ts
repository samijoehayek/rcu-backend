import { Inject, Service } from "@tsed/di";
import { UserLevelCompletionResponse } from "../../dtos/response/userLevelCompletion.response";
import { UserLevelCompletionRequest } from "../../dtos/request/userLevelCompletion.request";
import { USER_LEVEL_COMPLETION_REPOSITORY } from "../../repositories/userLevelCompletion/userLevelCompletion.repository";
import { MINIGAME_REPOSITORY } from "../../repositories/minigame/minigame.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class UserLevelCompletionService {
  @Inject(USER_LEVEL_COMPLETION_REPOSITORY)
  private userLevelCompletionRepository: USER_LEVEL_COMPLETION_REPOSITORY;

  @Inject(MINIGAME_REPOSITORY)
  private minigameRepository: MINIGAME_REPOSITORY;

  @Inject(USER_REPOSITORY)
  private userRepository: USER_REPOSITORY;

  public async completeLevel(
    userId: string,
    levelData: {
      minigameId: string;
      level: number;
      difficulty: string;
      timeToComplete?: number;
    }
  ): Promise<UserLevelCompletionResponse> {
    // Logic to record level completion
    const { minigameId, level, difficulty, timeToComplete } = levelData;

    // Check if the user and minigame are provided
    if (!userId || !minigameId) {
      throw new Error("User and minigame are required");
    }

    // Check if user and minigame exist in the database
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const minigame = await this.minigameRepository.findOne({
      where: { id: minigameId },
    });
    if (!user || !minigame) {
      throw new Error("User and minigame are not found");
    }

    // Validate level and difficulty are valid for this minigame
    // You might want to add your own validation logic here depending on your game structure
    if (level < 1 || level > 3) {
      throw new Error("Invalid level number. Levels must be between 1 and 3");
    }

    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      throw new Error("Invalid difficulty. Must be 'easy', 'medium', or 'hard'");
    }

    // Find existing level completion record
    const userLevelCompletion = await this.userLevelCompletionRepository.findOne({
      where: { userId, minigameId, level, difficulty },
    });

    // If no existing record, create a new one
    if (!userLevelCompletion) {
      const newLevelCompletion = await this.userLevelCompletionRepository.save({
        userId,
        minigameId,
        level,
        difficulty,
        timeToComplete: timeToComplete || 0,
        isCompleted: true,
        completedAt: new Date()
      });

      return newLevelCompletion;
    } else {
      // Update existing record with new completion time if it's better
      if (timeToComplete && (!userLevelCompletion.timeToComplete || timeToComplete < userLevelCompletion.timeToComplete)) {
        userLevelCompletion.timeToComplete = timeToComplete;
        userLevelCompletion.completedAt = new Date();
        
        const updatedLevelCompletion = await this.userLevelCompletionRepository.save(userLevelCompletion);
        return updatedLevelCompletion;
      }

      return userLevelCompletion;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserLevelCompletions(
    userId: string,
    filter?: any
  ): Promise<Array<UserLevelCompletionResponse>> {
    const whereClause = { userId, ...filter };
    const userLevelCompletions = await this.userLevelCompletionRepository.find({
      where: whereClause
    });
    return userLevelCompletions;
  }

  public async getStats(filters: {
    minigameId?: string;
    level?: number;
    difficulty?: string;
  }) {
    const whereClause: any = {};
    if (filters.minigameId) whereClause.minigameId = filters.minigameId;
    if (filters.level) whereClause.level = filters.level;
    if (filters.difficulty) whereClause.difficulty = filters.difficulty;

    const completions = await this.userLevelCompletionRepository.find({
      where: whereClause
    });
    
    // Calculate statistics
    const userIds = completions.map(completion => completion.userId);
    const uniqueUserIds = [...new Set(userIds)];
    
    // Calculate average completion time
    const totalTime = completions.reduce((sum, completion) => sum + (completion.timeToComplete || 0), 0);
    const averageTime = completions.length > 0 ? totalTime / completions.length : 0;
    
    return {
      totalCompletions: completions.length,
      uniqueUsers: uniqueUserIds.length,
      averageCompletionTime: averageTime,
      // Add more statistics as needed
    };
  }

  public async createUserLevelCompletion(
    payload: UserLevelCompletionRequest
  ): Promise<UserLevelCompletionResponse> {
    return await this.userLevelCompletionRepository.save({ ...payload });
  }

  public async updateUserLevelCompletion(
    id: string,
    payload: UserLevelCompletionRequest
  ): Promise<UserLevelCompletionResponse> {
    const userLevelCompletion = await this.userLevelCompletionRepository.findOne({
      where: { id: id },
    });
    if (!userLevelCompletion) throw new NotFound("User Level Completion not found");

    id = id.toLowerCase();
    await this.userLevelCompletionRepository.update(
      { id: id },
      { ...payload }
    );

    return userLevelCompletion;
  }

  public async removeUserLevelCompletion(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const userLevelCompletion = await this.userLevelCompletionRepository.findOne({
      where: { id: id },
    });
    if (!userLevelCompletion) throw new NotFound("User Level Completion not found");

    await this.userLevelCompletionRepository.remove(userLevelCompletion);
    return true;
  }
}