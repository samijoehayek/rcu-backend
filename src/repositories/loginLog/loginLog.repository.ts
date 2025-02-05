import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { LoginLog } from "../../models/loginLog";

export const LoginLogRepository = PostgresDataSource.getRepository(LoginLog);
export const LOGIN_LOG_REPOSITORY = Symbol.for("LoginLogRepository");
export type LOGIN_LOG_REPOSITORY = typeof LoginLogRepository;

registerProvider({
    provide: LOGIN_LOG_REPOSITORY,
    useValue: LoginLogRepository,
});
