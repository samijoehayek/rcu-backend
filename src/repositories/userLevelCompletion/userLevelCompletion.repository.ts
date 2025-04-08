import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserLevelCompletion } from "../../models/userLevelCompletion";

export const UserLevelCompletionRepository = PostgresDataSource.getRepository(UserLevelCompletion);
export const USER_LEVEL_COMPLETION_REPOSITORY = Symbol.for("UserLevelCompletionRepository");
export type USER_LEVEL_COMPLETION_REPOSITORY = typeof UserLevelCompletionRepository;

registerProvider({
    provide: USER_LEVEL_COMPLETION_REPOSITORY,
    useValue: UserLevelCompletionRepository,
});