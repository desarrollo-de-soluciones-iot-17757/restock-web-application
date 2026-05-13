import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AuthenticationRepository } from '../application/ports/authentication.repository';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';

import { SignUpAssembler } from './sign-up/sign-up.assembler';
import { SignUpResponse } from './sign-up/sign-up.response';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthenticationRepository implements AuthenticationRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/authentication';

  signUp(command: SignUpCommand): Observable<User> {
    const request = SignUpAssembler.toRequestFromCommand(command);
    const mockResponse: SignUpResponse = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      accountId: 'acc_' + Math.random().toString(36).substr(2, 9),
      email: request.email,
      roleId: request.roleId || 'RESTAURANT_MANAGER',
      plan: 'FREE',
      status: 'ACTIVE',
      token: 'mock_jwt_token',
    };
    return of(SignUpAssembler.toEntityFromResponse(mockResponse)).pipe(delay(500));
  }
}
