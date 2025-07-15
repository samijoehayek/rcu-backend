import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { UserVerification } from "../../models/userVerifcation";

export const UserVerificationRepository = PostgresDataSource.getRepository(UserVerification);
export const USER_VERIFICATION_REPOSITORY = Symbol.for("UserVerificationRepository");
export type USER_VERIFICATION_REPOSITORY = typeof UserVerificationRepository;

registerProvider({
    provide: USER_VERIFICATION_REPOSITORY,
    useValue: UserVerificationRepository,
});