import { Wearable } from "../../models/wearable";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const WearableRepository = PostgresDataSource.getRepository(Wearable);
export const WEARABLE_REPOSITORY = Symbol.for("WearableRepository");
export type WEARABLE_REPOSITORY = typeof WearableRepository;

registerProvider({
    provide: WEARABLE_REPOSITORY,
    useValue: WearableRepository,
});