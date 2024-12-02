import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Scene } from "../../models/scene";

export const SceneRepository = PostgresDataSource.getRepository(Scene);
export const SCENE_REPOSITORY = Symbol.for("SceneRepository");
export type SCENE_REPOSITORY = typeof SceneRepository;

registerProvider({
    provide: SCENE_REPOSITORY,
    useValue: SceneRepository,
});
