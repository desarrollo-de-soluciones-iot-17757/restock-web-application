import { Routes } from '@angular/router';

const baseTitle = 'RestockWebApplication';


/**
 * Root route configuration that composes bounded-context routes.
 */
export const appRoutes: Routes = [
  {
    path: 'settings',
    loadChildren: () =>
      import('./profiles/presentation/profiles.routes').then((m) => m.profilesRoutes),
  },
];
