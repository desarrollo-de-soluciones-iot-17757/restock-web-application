import { Routes } from '@angular/router';

export const profilesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/system-preferences/system-preferences').then(
        (m) => m.SystemPreferences,
      ),
    title: 'Profile Overview',
  },
  {
    path: 'register',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./views/registration-personal-profile/registration-personal-profile').then(
            (m) => m.RegistrationPersonalProfile,
          ),
        title: 'Create your Account',
      },
      {
        path: 'business',
        loadComponent: () =>
          import('./views/registration-business-details/registration-business-details').then(
            (m) => m.RegistrationBusinessDetails,
          ),
        title: 'Business details',
      },
    ],
  },
];
