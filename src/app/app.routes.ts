import { Routes } from '@angular/router';
import { profilesRoutes } from './profiles/presentation/profiles.routes';

const baseTitle = 'RestockWebApplication';


/**
 * Root route configuration that composes bounded-context routes.
 */
export const appRoutes: Routes = [
    { path: 'profiles', children: profilesRoutes }

];
