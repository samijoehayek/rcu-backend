import { Inject, Service } from "@tsed/di";
import { UserResponse } from "../../dtos/response/user.response";
import { UserRequest } from "../../dtos/request/user.request";
import { EncryptionService } from "../encryption/encryption.service";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ROLE_REPOSITORY } from "../../repositories/role/role.repository";
@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(ROLE_REPOSITORY)
  protected roleRepository: ROLE_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  public async signup(payload: UserRequest): Promise<UserResponse> {
    // Check if user created email and password
    if (payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptPassword = this.encryptionService.encryptMD5(
        payload.email + payload.password
      );
      payload.password = encryptPassword;
    } else {
      throw new Error("Email and password are required");
    }

    // If user did not choose a role, default to user
    if (!payload.roleId) {
      // Get the role id for normal user
      const role = await this.roleRepository.findOne({
        where: { roleName: "user" },
      });
      payload.roleId = role?.id;
    } else {
      const roleObject = await this.roleRepository.findOne({
        where: { id: payload.roleId },
      });
      // Check if the user chose a role of admin
      if (roleObject?.roleName.toLowerCase() === "admin") {
        throw new Error("You cannot create an admin account");
      }
    }

    // save the user
    const user = await this.userRepository.save({ ...payload });

    return user;
  }

  public async signupBatch(): Promise<{ total: number; created: number }> {
    const batchSize = 500; // Process in batches to avoid memory issues
    const totalAccounts = 10000;
    let successfulCreations = 0;

    // Find the default user role
    const defaultRole = await this.roleRepository.findOne({
      where: { roleName: "user" }, // Adjust based on your role naming convention
    });

    if (!defaultRole) {
      throw new Error("Default student role not found");
    }

    for (let i = 0; i < totalAccounts; i += batchSize) {
      // Generate batch of accounts
      const batchAccounts = this.generateAccountBatch(
        i + 1,
        Math.min(i + batchSize, totalAccounts),
        defaultRole.id
      );

      // Bulk create batch
      try {
        const creationResults = await this.createUserBatch(batchAccounts);
        successfulCreations += creationResults.length;
      } catch (error) {
        console.error(
          `Error creating batch starting from user ${i + 1}:`,
          error
        );
        // Optionally, you can choose to continue or break based on your requirements
      }
    }
    return {
      total: totalAccounts,
      created: successfulCreations,
    };
  }

  private generateAccountBatch(
    startIndex: number,
    endIndex: number,
    roleId: string
  ): UserRequest[] {
    const accounts: UserRequest[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const account: UserRequest = {
        username: `Student${i}`,
        password: `st${i}`, // Password pattern as specified
        roleId: roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      accounts.push(account);
    }

    return accounts;
  }

  private async createUserBatch(accounts: UserRequest[]): Promise<any[]> {
    // Use a transaction to ensure data integrity
    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const createdUsers = [];

        for (const account of accounts) {
          // Hash the password using your existing auth service
          const hashedPassword = this.encryptionService.encryptMD5(
            account.password
          );

          // Create user with hashed password
          const user = transactionalEntityManager.create(
            this.userRepository.target,
            {
              ...account,
              password: hashedPassword,
            }
          );

          const savedUser = await transactionalEntityManager.save(user);
          createdUsers.push(savedUser);
        }

        return createdUsers;
      }
    );
  }

  public async deleteBatch(): Promise<{ total: number; deleted: number }> {
    const batchSize = 500; // Process in batches to avoid memory issues
    const totalAccounts = 10000;
    let successfulDeletions = 0;

    // Find the default user role
    const defaultRole = await this.roleRepository.findOne({
      where: { roleName: "user" },
    });

    if (!defaultRole) {
      throw new Error("Default user role not found");
    }

    for (let i = 0; i < totalAccounts; i += batchSize) {
      const startIndex = i + 1;
      const endIndex = Math.min(i + batchSize, totalAccounts);

      try {
        // Find and delete batch of users
        const deletionResults = await this.deleteUserBatch(
          startIndex,
          endIndex,
          defaultRole.id
        );
        successfulDeletions += deletionResults.length;
      } catch (error) {
        console.error(
          `Error deleting batch starting from user ${startIndex}:`,
          error
        );
        // Optionally, you can choose to continue or break based on your requirements
      }
    }

    return {
      total: totalAccounts,
      deleted: successfulDeletions,
    };
  }

  private async deleteUserBatch(
    startIndex: number,
    endIndex: number,
    roleId: string
  ): Promise<any[]> {
    return this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Generate username pattern for bulk deletion
        const usernames = [];
        for (let i = startIndex; i <= endIndex; i++) {
          usernames.push(`Student${i}`);
        }

        // Perform bulk delete
        const deleteResult = await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(this.userRepository.target)
          .where("username IN (:...usernames)", { usernames })
          .andWhere("roleId = :roleId", { roleId })
          .execute();

        // Return deleted users (if needed for logging)
        return deleteResult.affected
          ? usernames.map((username) => ({ username }))
          : [];
      }
    );
  }
}
