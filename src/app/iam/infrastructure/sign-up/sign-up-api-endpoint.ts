import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SignUpCommand } from '../../domain/model/sign-up.command';
import { SignUpRequest } from './sign-up.request';
import { SignUpResponse } from './sign-up.response';
const signUpApiUrl = `${environment.platformProviderIamApiBaseUrl}/${environment.platformProviderSignUpEndpointPath}`;

/**
 * Endpoint for IAM sign-up requests.
 */
@Injectable({ providedIn: 'root' })
export class SignUpApiEndpoint {
  constructor(private readonly http: HttpClient) {}

  signUp(command: SignUpCommand): Observable<void> {
    const request: SignUpRequest = {
      email: command.email,
      password: command.password,
      roleId: command.roleId,
    };

    return this.http.post<SignUpResponse>(signUpApiUrl, request).pipe(map(() => undefined));
  }
}
