import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

import { TrackingApi } from '../infrastructure/tracking-api';
import { ConciliationTask } from '../domain/model/conciliation-task.entity';
import { Discrepancy } from '../domain/model/discrepancy.entity';


/**
 * View-model representation of a discrepancy row in the UI.
 */
export interface DiscrepancyRow {
  id: string;
  supplyName: string;
  deviceId: string;
  digitalStock: number;
  physicalStock: number;
  deviation: number;
  severity: string;
  detectionTime: string;
  status: string;
}

/**
 * View-model representation of a resolution history entry.
 */
export interface ResolutionHistoryEntry {
  id: string;
  timestamp: string;
  supply: string;
  category: string;
  stockBefore: number;
  iotReading: number;
  deviation: number;
  reason: string;
}

/**
 * Store responsible for managing the Tracking bounded context state.
 */
@Injectable({ providedIn: 'root' })
export class TrackingStore {
  readonly loading = signal(false);
  readonly loadError = signal(false);

  readonly discrepancies = signal<DiscrepancyRow[]>([]);
  readonly conciliationTasks = signal<ConciliationTask[]>([]);
  readonly selectedDiscrepancy = signal<Discrepancy | null>(null);
  readonly resolutionHistory = signal<ResolutionHistoryEntry[]>([]);

  readonly pendingTasksCount = signal(0);
  readonly totalResolved = signal(0);
  readonly criticalDeviations = signal(0);

  private readonly trackingApi = inject(TrackingApi);

  /**
   * Loads the list of active discrepancies.
   */
  loadDiscrepancies(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getDiscrepancies()
      .pipe(
        tap((data) => {
          this.discrepancies.set(data);
          this.pendingTasksCount.set(data.filter((d) => d.status === 'PENDING_REVIEW').length);
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  /**
   * Loads a single discrepancy by its identifier.
   *
   * @param id The discrepancy identifier.
   */
  loadDiscrepancyById(id: string): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getDiscrepancyById(id)
      .pipe(
        tap((data) => this.selectedDiscrepancy.set(data)),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  /**
   * Resolves a stock discrepancy with a given cause and justification.
   *
   * @param discrepancyId The discrepancy identifier.
   * @param cause The selected cause of the discrepancy.
   * @param justification The justification or evidence text.
   */
  resolveDiscrepancy(discrepancyId: string, cause: string, justification: string): void {
    this.loading.set(true);

    this.trackingApi
      .createConciliationTask({
        discrepancyId,
        cause,
        justification,
        resolvedAt: new Date().toISOString(),
      })
      .pipe(
        tap(() => {
          this.loadDiscrepancies();
          this.loadResolutionHistory();
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  /**
   * Sends a recalibration request for a device.
   *
   * @param deviceId The device identifier to recalibrate.
   * @param action The calibration action (force tare or schedule maintenance).
   * @param note Optional note for the recalibration.
   */
  recalibrateScale(deviceId: string, action: string, note: string): void {
    this.loading.set(true);

    this.trackingApi
      .recalibrateDevice(deviceId, action, note)
      .pipe(
        tap(() => this.loadDiscrepancies()),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  /**
   * Loads the resolution history entries.
   */
  loadResolutionHistory(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getResolutionHistory()
      .pipe(
        tap((data) => {
          this.resolutionHistory.set(data);
          this.totalResolved.set(data.length);
          this.criticalDeviations.set(
            data.filter((entry) => entry.deviation > 50).length,
          );
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
