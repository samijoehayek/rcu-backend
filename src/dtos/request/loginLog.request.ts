// For reference, assuming your LoginLog entity looks something like this:
import { Property } from "@tsed/schema";

export class LoginLogRequest {
  @Property()
  id: string;

  @Property()
  userId?: string;

  @Property()
  createdAt: Date;

  @Property()
  deviceInfo?: string;

  @Property()
  ipAddress?: string;

  @Property()
  userAgent?: string;
}
