import { Routes } from '@angular/router';

const salesList = () => import('./view/sales-list/sales-list').then(m => m.SalesList);

export const salesRoutes: Routes = [
  { path: 'sales', loadComponent: salesList }
];
