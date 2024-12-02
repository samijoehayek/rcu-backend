import { Property } from "@tsed/schema";

export class RoleRequest {
    @Property()  
    id?: string;

    @Property()  
    roleName: string;

    @Property()  
    roleDescription: string;

    @Property()  
    createdAt?: Date;
    
    @Property()  
    updatedAt?: Date;
}