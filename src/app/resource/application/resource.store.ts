import { Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { ResourceApi } from '../infrastructure/resource-api';
import type { BatchData, BatchRow } from '../infrastructure/batch/batch.assembler';

/**
 * Store responsible for managing the Resource feature state.
 *
 * It loads batch information from the Resource API and exposes reactive state
 * for presentation components.
 */
@Injectable({ providedIn: 'root' })
export class ResourceStore {
  readonly loading = signal(false);
  readonly loadError = signal(false);

  readonly totalActiveBatches = signal(0);
  readonly totalActiveBatchesDeltaPercent = signal(0);
  readonly nearExpiry30Days = signal(0);
  readonly rows = signal<BatchRow[]>([]);

  constructor(private readonly resourceApi: ResourceApi) {}

  /**
   * Loads batch data and updates the current Resource screen state.
   */
  refreshBatch(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.resourceApi
      .getBatch()
      .pipe(
        tap((batch: BatchData) => {
          this.totalActiveBatches.set(batch.totalActiveBatches);
          this.totalActiveBatchesDeltaPercent.set(batch.totalActiveBatchesDeltaPercent);
          this.nearExpiry30Days.set(batch.nearExpiry30Days);
          this.rows.set(batch.batches);
        }),
        catchError(() => {
          this.loadError.set(true);
          this.rows.set([]);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe();
  }
}
