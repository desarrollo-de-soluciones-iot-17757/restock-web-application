import { Routes } from '@angular/router';

const signUpForm = () => import('./views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);
const authenticationSection = () => import('./components/authentication-section/authentication-section').then((m) => m.AuthenticationSection);

export const iamRoutes: Routes = [
  {
    path: 'sign-up',
    loadComponent: signUpForm,
    title: 'Register',
  },
  {
    path: 'role-selection',
    loadComponent: authenticationSection,
    title: 'Select Role',
  },
];
