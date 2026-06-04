import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import { assembleBatch, BatchData } from './batch/batch.assembler';
import { BATCH_ENDPOINT } from './batch/batch.endpoint';
import type { CustomSupply } from '../domain/model/custom-supply.entity';

import type {
  BatchItemResponse,
  BatchRootResponse,
  CreateBatchRequest,
  TransferBatchRequest,
  UpdateBatchRequest,
} from './batch/batch.response';

export interface BranchResource {
  id: string;
  name: string;
  status?: string;
}

/**
 * HTTP entry point for the Resource bounded context.
 *
 * This API service centralizes access to resource-related data such as
 * batches, supplies and custom supplies.
 */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);
  private readonly primaryBaseUrl = '/api/v1';
  private readonly fallbackBaseUrl = 'http://localhost:8080/api/v1';
  private currentBaseUrl = this.primaryBaseUrl;

  private withFallback<T>(operation: () => Observable<T>): Observable<T> {
    const previous = this.currentBaseUrl;
    this.currentBaseUrl = this.fallbackBaseUrl;
    const result$ = operation();
    this.currentBaseUrl = previous;

    return result$;
  }

  private get batchesUrl(): string {
    return `${this.currentBaseUrl}/${BATCH_ENDPOINT}`;
  }

  private get branchesUrl(): string {
    return `${this.currentBaseUrl}/branches`;
  }

  /**
   * Loads batch data from the backend.
   * 
   * @param accountId Optional account filter.
   * @param customSupplies Supplies used to enrich table rows.
   * @returns An observable with assembled batch data.
   */
  getBatch(accountId?: string, customSupplies: CustomSupply[] = []): Observable<BatchData> {
    const operation = () => {
      const options = accountId ? { params: new HttpParams().set('accountId', accountId) } : undefined;

      return this.http
        .get<BatchRootResponse | BatchItemResponse[]>(this.batchesUrl, options)
        .pipe(map((response) => assembleBatch(response, customSupplies)));
    };

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Creates a batch.
   */
  createBatch(accountId: string, body: CreateBatchRequest): Observable<BatchItemResponse> {
    const params = new HttpParams().set('accountId', accountId);
    const operation = () => this.http.post<BatchItemResponse>(this.batchesUrl, body, { params });

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Updates a batch.
   */
  updateBatch(batchId: string, body: UpdateBatchRequest): Observable<BatchItemResponse> {
    const operation = () => this.http.patch<BatchItemResponse>(`${this.batchesUrl}/${encodeURIComponent(batchId)}`, body);

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Deletes a batch.
   */
  deleteBatch(batchId: string): Observable<void> {
    const operation = () => this.http.delete<void>(`${this.batchesUrl}/${encodeURIComponent(batchId)}`);

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Transfers stock from one batch to another branch.
   */
  transferBatch(batchId: string, body: TransferBatchRequest): Observable<BatchItemResponse> {
    const operation = () => this.http.post<BatchItemResponse>(
      `${this.batchesUrl}/${encodeURIComponent(batchId)}/transfer`,
      body,
    );

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  getBranches(accountId: string): Observable<BranchResource[]> {
    const params = new HttpParams().set('accountId', accountId);
    const operation = () => this.http.get<BranchResource[] | { data?: BranchResource[] }>(this.branchesUrl, { params }).pipe(
      map((response) => Array.isArray(response) ? response : response.data ?? []),
    );

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }
}
