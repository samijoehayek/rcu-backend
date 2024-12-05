import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Avatar } from "../../models/avatar";

export const AvatarRepository = PostgresDataSource.getRepository(Avatar);
export const AVATAR_REPOSITORY = Symbol.for("AvatarRepository");
export type AVATAR_REPOSITORY = typeof AvatarRepository;

registerProvider({
    provide: AVATAR_REPOSITORY,
    useValue: AvatarRepository,
});
 