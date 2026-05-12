import { Routes } from '@angular/router';


export const profilesRoutes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./views/registration-personal-profile/registration-personal-profile').then(
        (m) => m.RegistrationPersonalProfile
      ),
    title: 'Create your Account',
  },
];
