import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';

/**
 * IamStore
 * Handles authentication state and IAM operations for the IAM bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly iamApi = inject(IamApi);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  /**
   * Signs up a new user using the IAM API.
   * @param command - The sign-up command containing credentials and role selection.
   * @param onSuccess - Optional callback executed after successful sign-up.
   */
  signUp(command: SignUpCommand, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.iamApi
      .signUp(command)
      .pipe(
        tap((user) => {
          this.currentUserSignal.set(user);
          onSuccess?.();
        }),
        catchError((error) => {
          this.errorSignal.set(this.formatError(error, 'Failed to register user.'));
          return of(null);
        }),
        finalize(() => this.loadingSignal.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  /**
   * Formats error messages for display.
   * @param error - The error object received from the API.
   * @param fallback - The fallback error message.
   * @returns A user-friendly error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
