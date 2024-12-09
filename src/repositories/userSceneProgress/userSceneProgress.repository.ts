import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserSceneProgress } from "../../models/userSceneProgress";

export const UserSceneProgressRepository = PostgresDataSource.getRepository(UserSceneProgress);
export const USER_SCENE_PROGRESS_REPOSITORY = Symbol.for("UserSceneProgressRepository");
export type USER_SCENE_PROGRESS_REPOSITORY = typeof UserSceneProgressRepository;

registerProvider({
    provide: USER_SCENE_PROGRESS_REPOSITORY,
    useValue: UserSceneProgressRepository,
});
