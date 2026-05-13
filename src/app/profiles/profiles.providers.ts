import { Provider } from '@angular/core';
import { PROFILES_REPOSITORY } from './application/ports/profiles.repository';
import { ProfilesApi } from './infrastructure/profiles-api';

export const profilesProviders: Provider[] = [
  {
    provide: PROFILES_REPOSITORY,
    useClass: ProfilesApi,
  },
];
