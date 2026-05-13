import { SignUpCommand } from '../../domain/model/sign-up.command';
import { User } from '../../domain/model/user.entity';
import { SignUpRequest } from './sign-up.request';
import { SignUpResponse } from './sign-up.response';

/**
 * Mapper between IAM command/request/response contracts and domain entities.
 */
export class SignUpAssembler {
  static toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      email: command.email,
      password: command.password,
      roleId: command.roleId,
    };
  }

  static toEntityFromResponse(response: SignUpResponse): User {
    return new User({
      id: response.id,
      accountId: response.accountId,
      email: response.email,
      roleId: response.roleId,
      plan: response.plan,
      status: response.status,
      token: response.token,
    });
  }
}
