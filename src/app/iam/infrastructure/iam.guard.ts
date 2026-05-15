import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { IamStore } from '../application/iam.store';

/**
 * Guard that protects IAM routes based on authentication state.
 */
@Injectable({ providedIn: 'root' })
export class IamGuard implements CanActivate {
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isAuthenticated = this.iamStore.isAuthenticated();
    const isAuthRoute =
      state.url.includes('/sign-in') ||
      state.url.includes('/sign-up') ||
      state.url.includes('/forgot-password');

    if (!isAuthenticated && !isAuthRoute) {
      return this.router.parseUrl('/sign-in');
    }

    if (!isAuthenticated) {
      return this.router.parseUrl('/sign-up');
    }

    if (isAuthenticated && isAuthRoute) {
      return this.router.parseUrl('/home');
    }

    return true;
  }
}
