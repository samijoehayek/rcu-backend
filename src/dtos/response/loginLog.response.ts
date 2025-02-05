// For reference, assuming your LoginLog entity looks something like this:
import { Property } from "@tsed/schema";
import { UserResponse } from "./user.response";
import { User } from "../../models/user";

export class LoginLogResponse {
  @Property()
  id: string;

  @Property()
  userId?: string;

  @Property(() => UserResponse)
  user: User;

  @Property()
  createdAt: Date;

  @Property()
  deviceInfo?: string;

  @Property()
  ipAddress?: string;

  @Property()
  userAgent?: string;
}
