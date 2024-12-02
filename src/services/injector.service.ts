import { Inject, Service } from "@tsed/di";
import { SignupPassportProtocol } from "../protocols/signup-passport.protocol";
import { LoginPassportProtocol } from "../protocols/login-passport.passport";
import { AdminPassportProtocol } from "../protocols/admin-passport";
import { UserPassportProtocol } from "../protocols/user-passport.protocol";

@Service()
export class InjectorService {
  @Inject(SignupPassportProtocol)
  public signupPassportProtocol: SignupPassportProtocol;

  @Inject(LoginPassportProtocol)
  public loginPassportProtocol: LoginPassportProtocol;

  @Inject(AdminPassportProtocol)
  public adminPassportProtocol: AdminPassportProtocol;

  @Inject(UserPassportProtocol)
  public userPassportProtocol: UserPassportProtocol;
}
