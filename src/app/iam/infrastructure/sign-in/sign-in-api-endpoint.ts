import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SignInAssembler } from './sign-in.assembler';
import { SignInCommand } from '../../domain/model/sign-in.command';
import { SignInRequest } from './sign-in.request';
import { SignInResponse } from './sign-in.response';
import { User } from '../../domain/model/user.entity';

const signInApiUrl = `${environment.platformProviderIamApiBaseUrlForSignIn}/${environment.platformProviderSignInEndpointPath}`;

/**
 * Endpoint for IAM sign-in requests.
 */
@Injectable({ providedIn: 'root' })
export class SignInApiEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Authenticates a user.
   * @param command - The sign-in command containing credentials.
   * @returns An observable of the authenticated User entity.
   */
  signIn(command: SignInCommand): Observable<User> {
    const request: SignInRequest = SignInAssembler.toRequestFromCommand(command);

    return this.http
      .post<SignInResponse>(signInApiUrl, request)
      .pipe(map((response) => SignInAssembler.toEntityFromResponse(response)));
  }
}
