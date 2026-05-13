import { SignUpCommand } from '../../domain/model/sign-up.command';
import { User } from '../../domain/model/user.entity';
import { SignUpRequest } from './sign-up.request';
import { SignUpResponse } from './sign-up.response';

export class SignUpAssembler {
  static toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      email: command.email,
      password: command.password,
      roleId: command.roleId,
    };
  }

  static toEntityFromResponse(response: SignUpResponse): User {
    return {
      id: response.id,
      accountId: response.accountId,
      email: response.email,
      roleId: response.roleId,
      plan: response.plan,
      status: response.status,
    };
  }
}
