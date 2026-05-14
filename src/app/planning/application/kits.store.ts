import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KitsApi } from '../infrastructure/kits-api';
import { Kit } from '../domain/model/kit.entity';

/**
 * KitsStore
 * Handles the business logic and state management for Kit operations in the catalog.
 */
@Injectable({ providedIn: 'root' })
export class KitsStore {
  private readonly destroyRef = inject(DestroyRef);

  // State Signals (Private)
  private readonly kitsSignal = signal<Kit[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  // Readonly Signals (Public)
  readonly kits = this.kitsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  // Computed Signals
  readonly kitsCount = computed(() => this.kitsSignal().length);

  /**
   * Constructor
   * @param kitsApi - KitsApi instance for making API calls.
   */
  constructor(private kitsApi: KitsApi) {}

  /**
   * Loads all kits from the catalog.
   */
  loadKits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.kitsApi
      .getKits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (kits) => {
          this.kitsSignal.set(kits);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load kits from catalog.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Formats error messages for the store.
   * @private
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A string representing the error message.
   */
  private formatError(error: any, fallback: string): string {
    if (typeof error === 'string') return error;
    return error?.message || fallback;
  }

  /**
   * Clears the current state of the store.
   */
  clearStore(): void {
    this.kitsSignal.set([]);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }
}
