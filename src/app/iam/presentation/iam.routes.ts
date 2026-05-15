import { Routes } from '@angular/router';

const signUpForm = () => import('./views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);
const signInForm = () => import('./views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const authenticationSection = () => import('./components/authentication-section/authentication-section').then((m) => m.AuthenticationSection);
const forgotPassword = () => import('./views/forgot-password/forgot-password').then((m) => m.ForgotPasswordComponent);

export const iamRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: signInForm,
    title: 'Login',
  },
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
  {
    path: 'forgot-password',
    loadComponent: forgotPassword,
    title: 'Reset Password',
  },
];
