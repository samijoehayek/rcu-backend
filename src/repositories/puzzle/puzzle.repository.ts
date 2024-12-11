import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Puzzle } from "../../models/puzzle";

export const PuzzleRepository = PostgresDataSource.getRepository(Puzzle);
export const PUZZLE_REPOSITORY = Symbol.for("PuzzleRepository");
export type PUZZLE_REPOSITORY = typeof PuzzleRepository;

registerProvider({
    provide: PUZZLE_REPOSITORY,
    useValue: PuzzleRepository,
});
