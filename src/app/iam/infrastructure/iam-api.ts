import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignUpApiEndpoint } from './sign-up/sign-up-api-endpoint';

/**
 * IamApi
 * Infrastructure API facade for IAM operations.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  constructor(
    private readonly signUpEndpoint: SignUpApiEndpoint
  ) {
    super();
  }

  /**
   * Registers a new user.
   * @param command - The sign-up command containing user credentials.
   */
  signUp(command: SignUpCommand): Observable<User> {
    return this.signUpEndpoint.signUp(command);
  }

}
