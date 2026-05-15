import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';

const baseTitle = 'RestockWebApplication';
const planningRoute = () => import('./planning/presentation/planning.routes').then((m) => m.planningRoutes);

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'planning',
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'planning',
        loadChildren: planningRoute,
        title: `${baseTitle} · Planning`,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'planning',
  },
];
