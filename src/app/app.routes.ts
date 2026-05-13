import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { profilesRoutes } from './profiles/presentation/profiles.routes';
import { resourceInventoryRoutes } from './resource/presentation/resource.routes';

const baseTitle = 'RestockWebApplication';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-up',
  },
  {
    path: 'home',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/presentation/views/home/home-page').then((m) => m.HomePage),
        title: `${baseTitle} · Overview`,
      },
      {
        path: 'inventory',
        children: resourceInventoryRoutes,
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.recipes' },
        title: `${baseTitle} · Recipes`,
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.sales' },
        title: `${baseTitle} · Sales`,
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.alerts' },
        title: `${baseTitle} · Alerts`,
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.devices' },
        title: `${baseTitle} · Devices`,
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./profiles/presentation/views/system-preferences/system-preferences').then(
            (m) => m.SystemPreferences,
          ),
        title: `${baseTitle} · Settings`,
      },
    ],
  },
  {
    path: 'profiles',
    loadComponent: () => import('./shared/presentation/components/layout/layout').then(m => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./profiles/presentation/views/system-preferences/system-preferences').then(
            (m) => m.SystemPreferences,
          ),
        title: 'Profile Overview',
      },
    ]
  },
  {
    path: 'profiles/register',
    loadComponent: () =>
      import('./profiles/presentation/views/registration-personal-profile/registration-personal-profile').then(
        (m) => m.RegistrationPersonalProfile,
      ),
    title: 'Create your Account',
  },
  {
    path: 'profiles/register/business',
    loadComponent: () =>
      import('./profiles/presentation/views/registration-business-details/registration-business-details').then(
        (m) => m.RegistrationBusinessDetails,
      ),
    title: 'Business details',
  },
  {
    path: '',
    loadChildren: () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound),
    title: `${baseTitle} · Not found`,
  },
];
