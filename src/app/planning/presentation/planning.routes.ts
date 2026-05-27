import { Routes } from '@angular/router';

// Definición de cargas perezosas (Lazy Loading) apuntando a tus vistas de Planning
const kitList = () =>
  import('./views/kits-catalog/kits-catalog').then((m) => m.PlanningDashboardComponent);
const kitForm = () =>
  import('./views/recipe-form/recipe-form').then((m) => m.KitFormModalComponent);

/**
 * Route tree for planning presentation views.
 */
export const planningRoutes: Routes = [
  // ◄ ¡IGUAL QUE EL PROFE! Exportación nombrada
  { path: 'kits', loadComponent: kitList },
  { path: 'kits/new', loadComponent: kitForm },
  { path: 'kits/:id/edit', loadComponent: kitForm },
];
