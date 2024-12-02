import { Property } from "@tsed/schema";
import { Role } from "../../models/role";
import { RoleResponse } from "./role.response";

export class UserResponse {
  @Property()
  id: string;

  @Property()
  username: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  roleId: string;

  @Property(() => RoleResponse)
  role: Role;

  @Property()
  createdAt: Date;

  @Property()
  updatedAt: Date;
}
