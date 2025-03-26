import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { SceneCompletion } from "../../models/sceneCompletion";

export const SceneCompletionRepository = PostgresDataSource.getRepository(SceneCompletion);
export const SCENE_COMPLETION_REPOSITORY = Symbol.for("SceneCompletionRepository");
export type SCENE_COMPLETION_REPOSITORY = typeof SceneCompletionRepository;

registerProvider({
    provide: SCENE_COMPLETION_REPOSITORY,
    useValue: SceneCompletionRepository,
});
