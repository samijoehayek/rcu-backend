import { Role } from "../../models/role";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { registerProvider } from "@tsed/di";

export const RoleRepository = PostgresDataSource.getRepository(Role);
export const ROLE_REPOSITORY = Symbol.for("RoleRepository");
export type ROLE_REPOSITORY = typeof RoleRepository;

registerProvider({
    provide: ROLE_REPOSITORY,
    useValue: RoleRepository,
});