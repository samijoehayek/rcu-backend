import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Badge } from "../../models/badge";

export const BadgeRepository = PostgresDataSource.getRepository(Badge);
export const BADGE_REPOSITORY = Symbol.for("BadgeRepository");
export type BADGE_REPOSITORY = typeof BadgeRepository;

registerProvider({
    provide: BADGE_REPOSITORY,
    useValue: BadgeRepository,
});
