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
    const id = String(response.id);
    return new User({
      id,
      accountId: response.accountId ?? `acct_${id}`,
      email: response.email,
      roleId: response.roleId,
      plan: response.plan ?? 'FREE',
      status: response.status ?? 'ACTIVE',
      token: response.token,
    });
  }
}
