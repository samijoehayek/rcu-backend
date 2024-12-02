import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { RoleRequest } from "../../dtos/request/role.request";
import { RoleResponse } from "../../dtos/response/role.response";
import { ROLE_REPOSITORY } from "../../repositories/role/role.repository";

@Service()
export class RoleService {
    @Inject(ROLE_REPOSITORY)
    protected roleRepository: ROLE_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getRole(filter?: any): Promise<Array<RoleResponse>> {
        // Set filter 'roleNmae' to lowercase, this is done to avoid confusion
        if(filter?.where.roleName) filter.where.roleName = String(filter.where.roleName).toLowerCase();

        // If filter is provided, use it to find role, else find all roles
        const role = filter ? await this.roleRepository.find(filter) : await this.roleRepository.find();
        if(!role) return [];

        // Return role objects in the form of Role Response
        return role;
    }

    public async createRole(payload: RoleRequest): Promise<RoleResponse> {
        // Set role name to lowercase, this is done to avoid duplicate role names
        if(payload.roleName) payload.roleName = String(payload.roleName).toLowerCase();

        // Check if role with this name exists, if it does throw an error
        const role = await this.roleRepository.findOne({ where: { roleName: payload.roleName } });
        if (role)
            throw new NotFound("role with this name exists");

        // Set role id to lowercase
        if(payload.id) payload.id = String(payload.id).toLowerCase();

        // Return the role created 
        return await this.roleRepository.save({...payload});
    }

    public async updateRole(id: string, payload: RoleRequest): Promise<RoleResponse> {
        // Make id lowercase in case it is sent with a capital letter
        id = id.toLowerCase();

        // Get the role with the given id
        const role = await this.roleRepository.findOne({ where: { id: id } });
        if (!role)
            throw new NotFound("role not found");

         // Set role name to lowercase, this is done to avoid duplicate role names
         if(payload.roleName) payload.roleName = String(payload.roleName).toLowerCase();

        // Update role with the role payload sent in the form of RoleRequest
        await this.roleRepository.update({ id: id }, { ...payload });

        // Return the updated role
        return role;
    }

    public async removeRole(id: string): Promise<boolean> {
        // Make id lowercase in case it is sent with a capital letter
        id = id.toLowerCase();

        // Get the role with the given id
        const role = await this.roleRepository.findOne({ where: { id: id } });
        if (!role)
            throw new NotFound("role not found");

        // Remove the role
        await this.roleRepository.remove(role);

        // Return true if role is removed
        return true;
    }
}
