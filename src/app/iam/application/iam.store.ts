import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { IamRegisteredUsersStorage } from '../infrastructure/iam-registered-users.storage';
import { IamSessionStorage } from '../infrastructure/iam-session.storage';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { ForgotPasswordCommand } from '../domain/model/forgot-password.command';

/**
 * IamStore
 * Handles authentication state and IAM operations for the IAM bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly router = inject(Router);
  private readonly iamApi = inject(IamApi);
  private readonly sessionStorage = inject(IamSessionStorage);
  private readonly registeredUsers = inject(IamRegisteredUsersStorage);

  private readonly currentUserSignal = signal<User | null>(this.sessionStorage.load());
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly successMessageSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly successMessage = this.successMessageSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  /**
   * Signs in an existing user.
   * @param command - The sign-in command.
   * @param onSuccess - Optional callback.
   */
  signIn(command: SignInCommand, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessageSignal.set(null);

    this.iamApi.signIn(command).subscribe({
      next: (user) => {
        this.setCurrentUser(user);
        onSuccess?.();
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'No se pudo iniciar sesión.'));
      },
      complete: () => this.loadingSignal.set(false),
    });
  }

  /**
   * Signs up a new user using the IAM API.
   * @param command - The sign-up command containing credentials and role selection.
   * @param onSuccess - Optional callback executed after successful sign-up.
   */
  signUp(command: SignUpCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessageSignal.set(null);
    this.clearAuthSession();

    const password = command.password ?? '';

    const finishAndGoToSignIn = (message: string) => {
      this.registeredUsers.register(command.email, password);
      this.clearAuthSession();
      this.successMessageSignal.set(message);
      this.loadingSignal.set(false);
      void this.router.navigateByUrl('/sign-in', { replaceUrl: true });
    };

    this.iamApi.signUp(command).subscribe({
      next: () => {
        finishAndGoToSignIn(
          'Cuenta creada correctamente. Inicia sesión con tu correo y contraseña.',
        );
      },
      error: () => {
        if (password) {
          finishAndGoToSignIn(
            'Cuenta guardada localmente. Inicia sesión con tu correo y contraseña.',
          );
          return;
        }
        this.errorSignal.set('No se pudo registrar el usuario.');
        this.loadingSignal.set(false);
      },
    });
  }

  private clearAuthSession(): void {
    this.currentUserSignal.set(null);
    this.sessionStorage.clear();
  }

  /**
   * @param command - El comando con el email del usuario.
   * @param onSuccess - Callback para notificar al usuario que revise su correo.
   */
  forgotPassword(command: ForgotPasswordCommand, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.iamApi.forgotPassword(command).subscribe({
      next: () => onSuccess?.(),
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'No se pudo enviar el correo de recuperación.'));
      },
      complete: () => this.loadingSignal.set(false),
    });
  }

  /**
   * Clears the authenticated session and persisted credentials.
   */
  signOut(): void {
    this.setCurrentUser(null);
    this.errorSignal.set(null);
    this.successMessageSignal.set(null);
  }

  clearSuccessMessage(): void {
    this.successMessageSignal.set(null);
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      this.sessionStorage.save(user);
    } else {
      this.sessionStorage.clear();
    }
  }

  /**
   * Formats error messages for display.
   */
  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
      return error.message.includes('Resource not found')
        ? `${fallback}: recurso no encontrado.`
        : error.message;
    }
    return fallback;
  }
}
