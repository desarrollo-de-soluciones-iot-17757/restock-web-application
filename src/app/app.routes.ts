import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { profilesRoutes } from './profiles/presentation/profiles.routes';
import { resourceInventoryRoutes } from './resource/presentation/resource.routes';

const baseTitle = 'RestockWebApplication';

const iamRoute = () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);
const salesRoute = () => import('./sales/presentation/sales.routes').then((m) => m.salesRoutes);
const profilesRoute = () => import('./profiles/presentation/profiles.routes').then(m => m.profilesRoutes);

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: iamRoute,
    title: `${baseTitle} · Sign Up`,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./shared/presentation/views/home/home-page').then((m) => m.HomePage),
        title: `${baseTitle} · Overview`,
      },
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
        path: 'profiles',
        children: profilesRoutes,
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then(
            (m) => m.PlaceholderPage,
          ),
        data: { titleKey: 'nav.recipes' },
        title: `${baseTitle} · Recipes`,
      },
      {
        path: 'sales',
        loadChildren: salesRoute,
        title: `${baseTitle} · Sales`,
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then(
            (m) => m.PlaceholderPage,
          ),
        data: { titleKey: 'nav.alerts' },
        title: `${baseTitle} · Alerts`,
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then(
            (m) => m.PlaceholderPage,
          ),
        data: { titleKey: 'nav.devices' },
        title: `${baseTitle} · Devices`,
      },
      {
        path: 'settings',
        loadChildren: profilesRoute,
        title: `${baseTitle} · Settings`,
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then(
        (m) => m.PageNotFound,
      ),
    title: `${baseTitle} · Not found`,
  },
];
