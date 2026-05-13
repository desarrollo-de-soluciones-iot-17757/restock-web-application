import { Routes } from '@angular/router';
import { SignUpForm } from './views/sign-up-form/sign-up-form';
import { AuthenticationSection } from './components/authentication-section/authentication-section';

export const iamRoutes: Routes = [
  {
    path: 'sign-up',
    component: SignUpForm,
    title: 'Register',
  },
  {
    path: 'role-selection',
    component: AuthenticationSection,
    title: 'Select Role',
  }
];
