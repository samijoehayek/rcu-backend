import { Property } from "@tsed/schema";
import { User } from "../../models/user";

export class AuthResponse {
    @Property(() => User)
    public user: User;

    @Property()
    public token: string;
}