import { Provider } from '@angular/core';
import { AUTHENTICATION_REPOSITORY } from './application/ports/authentication.repository';
import { HttpAuthenticationRepository } from './infrastructure/http-authentication.repository';

export const iamProviders: Provider[] = [
  {
    provide: AUTHENTICATION_REPOSITORY,
    useClass: HttpAuthenticationRepository,
  },
];
