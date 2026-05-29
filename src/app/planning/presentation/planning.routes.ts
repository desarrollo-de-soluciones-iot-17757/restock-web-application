import { Routes } from '@angular/router';

const kitList = () =>
  import('./views/kits-catalog/kits-catalog').then((m) => m.PlanningDashboardComponent);

/**
 * Route tree for planning presentation views.
 */
export const planningRoutes: Routes = [
  { path: 'kits', loadComponent: kitList },
];
