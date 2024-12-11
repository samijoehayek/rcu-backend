import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserMinigameProgress } from "../../models/userMinigameProgress";

export const UserMinigameProgressRepository = PostgresDataSource.getRepository(UserMinigameProgress);
export const USER_MINIGAME_PROGRESS_REPOSITORY = Symbol.for("UserMinigameProgressRepository");
export type USER_MINIGAME_PROGRESS_REPOSITORY = typeof UserMinigameProgressRepository;

registerProvider({
    provide: USER_MINIGAME_PROGRESS_REPOSITORY,
    useValue: UserMinigameProgressRepository,
});
