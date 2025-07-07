import { Inject, Service } from "@tsed/di";
import { UserResponse } from "../../dtos/response/user.response";
import { UserRequest } from "../../dtos/request/user.request";
import { EncryptionService } from "../encryption/encryption.service";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ROLE_REPOSITORY } from "../../repositories/role/role.repository";
import { USER_PASSWORD_VERIFICATION_REPOSITORY } from "../../repositories/userPasswordVerification/userPasswordVerification.repository";
import { v4 as uuidv4 } from "uuid";
import { TransporterService } from "../../services/transporter.service";
import { USER_VERIFICATION_REPOSITORY } from "../../repositories/userVerification/userVerification.repository";

@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(ROLE_REPOSITORY)
  protected roleRepository: ROLE_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  
  @Inject(USER_VERIFICATION_REPOSITORY)
  protected userVerificationRepository: USER_VERIFICATION_REPOSITORY;

  @Inject(USER_PASSWORD_VERIFICATION_REPOSITORY)
  protected userPasswordVerificationRepository: USER_PASSWORD_VERIFICATION_REPOSITORY;

  @Inject(TransporterService)
  protected transporterService: TransporterService;

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
  
  public async forgotPasswordEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new Error("Email does not exist");

    const currentUrl = "http://localhost:3000/create-new-password?userId=" + user.id + "&verificationString=";
    const uniqueString = uuidv4();

    // Save the user verification request
    await this.userPasswordVerificationRepository.save({
      userId: user.id,
      verificationToken: uniqueString,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
    });

    // This is the email content being sent
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="font-size: 24px; margin: 0; color: #333333;">Password Reset Request</h2>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">Hello,</p>
          <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">You have requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              currentUrl + uniqueString
            }" style="display: inline-block; padding: 14px 28px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666666; margin-top: 20px;">This link will expire in 6 hours for security reasons.</p>
          <p style="font-size: 14px; color: #666666; margin-top: 20px;">If you didn't request this password reset, please ignore this email.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #999999; margin: 0;">This is an automated email. Please do not reply.</p>
          <p style="font-size: 12px; color: #999999; margin: 5px 0 0 0;">For support, contact us at <a href="mailto:support@yourapp.com" style="color: #007bff; text-decoration: none;">support@yourapp.com</a></p>
        </div>
      </div>
    `;
    await this.transporterService.sendEmail({ html, subject: "Reset Password", to: email });

    return true;
  }

  public async forgotPassword(token: string, newPassword: string): Promise<boolean> {
    const userPasswordVerification = await this.userPasswordVerificationRepository.findOne({ where: { verificationToken: token } });
    if (!userPasswordVerification) throw new Error("Invalid token");

    const user = await this.userRepository.findOne({ where: { id: userPasswordVerification.userId } });
    if (!user) throw new Error("User not found");

    const isExpired = userPasswordVerification.expiresAt < new Date();
    if (isExpired) throw new Error("Token has expired");

    if (!newPassword) throw new Error("New password is required");

    if (userPasswordVerification.passwordChanged) throw new Error("Password has already been changed, Create new request");

    const encryptedPassword = this.encryptionService.encryptMD5(user.email + newPassword); //encrypt new password encruptservice given
    if (encryptedPassword === user.password) throw new Error("New password must be different from old password");

    await this.userRepository.update({ id: user.id }, { password: encryptedPassword });

    await this.userPasswordVerificationRepository.update({ id: userPasswordVerification.id }, { passwordChanged: true });

    // This is the email content being sent
    const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="font-size: 24px; margin: 0; color: #333333;">Password Reset Successful</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">Hello,</p>
        <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">Your password has been successfully updated.</p>
        <p style="font-size: 14px; color: #666666; margin-top: 20px;">If you didn't make this change, please contact our support team immediately.</p>
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #999999; margin: 0;">This is an automated email. Please do not reply.</p>
        <p style="font-size: 12px; color: #999999; margin: 5px 0 0 0;">For support, contact us at <a href="mailto:support@yourapp.com" style="color: #007bff; text-decoration: none;">support@yourapp.com</a></p>
      </div>
    </div>
  `;
    await this.transporterService.sendEmail({ html, subject: "Success!!", to: user.email });

    return true;
  }

}


