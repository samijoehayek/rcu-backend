import { Property } from "@tsed/schema";

export class LoginRequest {
    @Property()
    username: string;

    @Property()
    password: string;
}