import { Routes } from '@angular/router';

const kitsList = () =>
  import('./views/kits-inventory/kits-inventory').then((m) => m.KitsInventoryComponent);

export const planningRoutes: Routes = [
  {
    path: '',
    loadComponent: kitsList,
  },
  {
    path: 'kits',
    loadComponent: kitsList,
  },
];
