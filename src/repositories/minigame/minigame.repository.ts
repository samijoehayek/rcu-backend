import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Minigame } from "../../models/minigame";

export const MinigameRepository = PostgresDataSource.getRepository(Minigame);
export const MINIGAME_REPOSITORY = Symbol.for("MinigameRepository");
export type MINIGAME_REPOSITORY = typeof MinigameRepository;

registerProvider({
    provide: MINIGAME_REPOSITORY,
    useValue: MinigameRepository,
});
