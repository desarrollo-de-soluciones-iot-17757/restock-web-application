import { Routes } from '@angular/router';

const devicesRoutes = () =>
  import('./devices/presentation/devices.routes').then(m => m.devicesRoutes);

const baseTitle = 'RestockWebApplication';

/**
 * Application routes configuration.
 * Defines the routing structure for the Angular application, including lazy-loaded components and child routes.
 */
export const appRoutes: Routes = [
  { path: 'devices', loadChildren: devicesRoutes },
];
