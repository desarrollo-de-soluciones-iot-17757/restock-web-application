import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { AUTHENTICATION_REPOSITORY } from './ports/authentication.repository';
import { User } from '../domain/model/user.entity';
import { SignUpCommand } from '../domain/model/sign-up.command';

@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly authRepository = inject(AUTHENTICATION_REPOSITORY);

  readonly currentUser = signal<User | null>(null);
  readonly loadError = signal(false);
  readonly loading = signal(false);

  signUp(command: SignUpCommand, onSuccess: () => void): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.authRepository
      .signUp(command)
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
          onSuccess();
        }),
        catchError(() => {
          this.loadError.set(true);
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
