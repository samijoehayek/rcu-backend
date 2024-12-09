import { UserWearable } from "../../models/userWearable";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const UserWearableRepository = PostgresDataSource.getRepository(UserWearable);
export const USER_WEARABLE_REPOSITORY = Symbol.for("UserWearableRepository");
export type USER_WEARABLE_REPOSITORY = typeof UserWearableRepository;

registerProvider({
    provide: USER_WEARABLE_REPOSITORY,
    useValue: UserWearableRepository,
});