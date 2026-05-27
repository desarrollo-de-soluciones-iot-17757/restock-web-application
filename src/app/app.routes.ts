import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';

const baseTitle = 'RestockWebApplication';
const planningRoute = () =>
  import('./planning/presentation/planning.routes').then((m) => m.planningRoutes);

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/planning/kits',
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'planning',
        loadChildren: planningRoute,
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
