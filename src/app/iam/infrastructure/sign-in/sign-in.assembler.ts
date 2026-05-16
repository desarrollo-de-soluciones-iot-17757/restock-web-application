import { User } from '../../domain/model/user.entity';
import { SignInCommand } from '../../domain/model/sign-in.command';
import { SignInRequest } from './sign-in.request';
import { SignInResponse } from './sign-in.response';

export class SignInAssembler {
  /**
   * Maps a SignInCommand to a SignInRequest for the API.
   */
  static toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      email: command.email,
      password: command.password,
    };
  }

  /**
   * Maps a SignInResponse to a User domain entity.
   */
  static toEntityFromResponse(response: SignInResponse): User {
    const id = String(response.id ?? '1');

    return new User({
      id,
      accountId: `acct_${id}`,
      email: response.email ?? '',
      roleId: 'ROLE_USER',
      plan: 'FREE',
      status: 'ACTIVE',
      token: response.token ?? `beeceptor-token-${id}`,
    });
  }
}
