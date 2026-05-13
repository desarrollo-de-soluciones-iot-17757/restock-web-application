import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/model/user.entity';
import { SignUpCommand } from '../../domain/model/sign-up.command';

export interface AuthenticationRepository {
  signUp(command: SignUpCommand): Observable<User>;
}

export const AUTHENTICATION_REPOSITORY = new InjectionToken<AuthenticationRepository>(
  'AuthenticationRepository'
);
