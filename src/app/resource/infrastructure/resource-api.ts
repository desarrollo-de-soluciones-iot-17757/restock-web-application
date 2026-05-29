import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { assembleBatch, BatchData } from './batch/batch.assembler';

import { SIMULATED_BATCH_ROOT } from './batch/batch.simulated-root';

import type { BatchRootResponse } from './batch/batch.response';

/**
 * HTTP entry point for the Resource bounded context.
 *
 * This API service centralizes access to resource-related data such as
 * batches, supplies and custom supplies.
 */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);

  /**
   * Loads simulated batch data.
   *
   * This method is temporary and should be replaced by the HTTP version once
   * the backend or Beeceptor endpoint is ready.
   *
   * @returns An observable with assembled batch data.
   */
  getBatch(): Observable<BatchData> {
    return of(SIMULATED_BATCH_ROOT).pipe(map(assembleBatch));
  }

  /**
   * Loads batch data from a remote URL.
   *
   * @param url Full API URL.
   * @returns An observable with assembled batch data.
   */
  getBatchFromUrl(url: string): Observable<BatchData> {
    return this.http.get<BatchRootResponse>(url).pipe(map(assembleBatch));
  }
}
