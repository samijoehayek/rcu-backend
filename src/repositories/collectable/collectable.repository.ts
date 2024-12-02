import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Collectable } from "../../models/collectable";

export const CollectableRepository = PostgresDataSource.getRepository(Collectable);
export const COLLECTABLE_REPOSITORY = Symbol.for("CollectableRepository");
export type COLLECTABLE_REPOSITORY = typeof CollectableRepository;

registerProvider({
    provide: COLLECTABLE_REPOSITORY,
    useValue: CollectableRepository,
});
