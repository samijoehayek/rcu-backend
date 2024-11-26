import { Inject, Service } from "@tsed/di";
import { SignupPassportProtocol } from "../protocols/signup-passport.protocol";
import { LoginPassportProtocol } from "../protocols/login-passport.passport";

@Service()
export class InjectorService {
  @Inject(SignupPassportProtocol)
  public signupPassportProtocol: SignupPassportProtocol;

  @Inject(LoginPassportProtocol)
  public loginPassportProtocol: LoginPassportProtocol;
}
