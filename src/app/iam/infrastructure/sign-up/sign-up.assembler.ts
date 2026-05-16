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
    const userData = response.user;
    const id = String(userData.id);
    return new User({
      id,
      accountId: userData.accountId ?? `acct_${id}`,
      email: userData.email,
      roleId: userData.roleId ?? 'ROLE_ADMIN', // Defaulting if not in mock
      plan: userData.plan ?? 'FREE',
      status: userData.status ?? 'ACTIVE',
      token: userData.token,
    });
  }
}
