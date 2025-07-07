import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserPasswordVerification } from "../../models/userPasswordVerification";

export const UserPasswordVerificationRepository = PostgresDataSource.getRepository(UserPasswordVerification);
export const USER_PASSWORD_VERIFICATION_REPOSITORY = Symbol.for("UserPasswordVerificationRepository");
export type USER_PASSWORD_VERIFICATION_REPOSITORY = typeof UserPasswordVerificationRepository;

registerProvider({
    provide: USER_PASSWORD_VERIFICATION_REPOSITORY,
    useValue: UserPasswordVerificationRepository,
});