import { Routes } from '@angular/router';
import { SystemPreferences } from './views/system-preferences/system-preferences';

export const profilesRoutes: Routes = [
  {
    path: '',
    component: SystemPreferences,
    title: 'System Preferences',
  },
];
