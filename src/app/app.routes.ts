import { Routes } from '@angular/router';

const baseTitle = 'RestockWebApplication';

const salesRoutes = () => import('./sales/presentation/sales.routes').then((m) => m.salesRoutes);

/**
 * Root route configuration that composes bounded-context routes.
 */
export const appRoutes: Routes = [
  { path: 'sales', loadChildren: salesRoutes },
];
