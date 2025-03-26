import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { MinigameCompletion } from "../../models/minigameCompletion";

export const MinigameCompletionRepository = PostgresDataSource.getRepository(MinigameCompletion);
export const MINIGAME_COMPLETION_REPOSITORY = Symbol.for("MinigameCompletionRepository");
export type MINIGAME_COMPLETION_REPOSITORY = typeof MinigameCompletionRepository;

registerProvider({
    provide: MINIGAME_COMPLETION_REPOSITORY,
    useValue: MinigameCompletionRepository,
});
