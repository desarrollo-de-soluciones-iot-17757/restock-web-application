import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, EMPTY, finalize, forkJoin, map, of, tap } from 'rxjs';

import { ResourceApi } from '../infrastructure/resource-api';
import type { BatchData, BatchRow } from '../infrastructure/batch/batch.assembler';
import type { BranchResource } from '../infrastructure/resource-api';
import { CustomSupply } from '../domain/model/custom-supply.entity';
import { Supply } from '../domain/model/supply.entity';
import type { CreateBatchCommand } from '../domain/commands/create-batch.command';
import type { UpdateBatchCommand } from '../domain/commands/update-batch.command';
import type { TransferBatchCommand } from '../domain/commands/transfer-batch.command';
import {
  AccountCustomSuppliesResponse,
  CustomSupplyRequest,
  CustomSupplyResponse,
} from '../infrastructure/custom-supply/custom-supply.response';
import { SupplyResponse } from '../infrastructure/supply/supply.response';
import { assembleCustomSupply } from '../infrastructure/custom-supply/custom-supply.assembler';
import { assembleSupply } from '../infrastructure/supply/supply.assembler';
import { CUSTOM_SUPPLY_ENDPOINT } from '../infrastructure/custom-supply/custom-supply.endpoint';
import { SUPPLY_ENDPOINT } from '../infrastructure/supply/supply.endpoint';

/**
 * Store responsible for managing the Resource feature state.
 */
@Injectable({ providedIn: 'root' })
export class ResourceStore {
  readonly loading = signal(false);
  readonly loadError = signal(false);

  readonly totalActiveBatches = signal(0);
  readonly totalActiveBatchesDeltaPercent = signal(0);
  readonly nearExpiry30Days = signal(0);
  readonly rows = signal<BatchRow[]>([]);

  readonly customSupplies = signal<CustomSupply[]>([]);
  readonly supplyTemplates = signal<Supply[]>([]);
  readonly branches = signal<BranchResource[]>([]);
  readonly accountId = signal('6a1e6a7f6da7ea565b1c50b2');

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly resourceApi = inject(ResourceApi);

  /**
   * Loads custom supplies first, then batches enriched with their metadata.
   */
  refreshBatch(): void {
    this.loading.set(true);
    this.loadError.set(false);

    forkJoin({
      customSupplies: this.fetchCustomSuppliesByAccount(this.accountId()).pipe(
        catchError((error: any) => {
          this.handleAuthError(error);
          return of([]);
        }),
      ),
      branches: this.resourceApi.getBranches(this.accountId()).pipe(catchError(() => of([]))),
    }).subscribe(({ customSupplies, branches }) => {
      this.customSupplies.set(customSupplies);
      this.branches.set(branches);

      this.resourceApi
        .getBatch(this.accountId(), customSupplies)
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
    });
  }

  setAccountId(accountId: string): void {
    if (accountId) {
      this.accountId.set(accountId);
    }
  }

  loadInventoryContext(accountId = this.accountId()): void {
    this.setAccountId(accountId);
    this.loadCustomSuppliesByAccount(accountId);
    this.resourceApi.getBranches(accountId).pipe(
      tap((branches) => this.branches.set(branches)),
      catchError(() => of([])),
    ).subscribe();
  }

  createBatch(command: CreateBatchCommand): void {
    this.resourceApi.createBatch(command.accountId, {
      code: command.code,
      currentStock: command.currentStock,
      customSupplyId: command.customSupplyId,
      branchId: command.branchId,
      expirationDate: command.expirationDate,
    }).pipe(
      tap(() => this.refreshBatch()),
      catchError(() => {
        this.loadError.set(true);
        return EMPTY;
      }),
    ).subscribe();
  }

  updateBatch(command: UpdateBatchCommand): void {
    this.resourceApi.updateBatch(command.id, {
      code: command.code,
      currentStock: command.currentStock,
      expirationDate: command.expirationDate,
    }).pipe(
      tap(() => this.refreshBatch()),
      catchError(() => {
        this.loadError.set(true);
        return EMPTY;
      }),
    ).subscribe();
  }

  transferBatch(command: TransferBatchCommand): void {
    this.resourceApi.transferBatch(command.batchId, {
      targetBranchId: command.targetBranchId,
      quantity: command.quantity,
      unitMeasurement: command.unitMeasurement,
      reason: command.reason,
    }).pipe(
      tap(() => this.refreshBatch()),
      catchError(() => {
        this.loadError.set(true);
        return EMPTY;
      }),
    ).subscribe();
  }

  deleteBatch(batchId: string): void {
    this.resourceApi
      .deleteBatch(batchId)
      .pipe(
        tap(() => {
          this.rows.update((rows) => rows.filter((row) => row.id !== batchId));
          this.totalActiveBatches.update((total) => Math.max(0, total - 1));
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  loadCustomSuppliesByAccount(accountId: string): void {
    this.loading.set(true);
    this.fetchCustomSuppliesByAccount(accountId)
      .pipe(
        tap((supplies: CustomSupply[]) => {
          this.customSupplies.set(supplies);
        }),
        catchError((error: any) => {
          this.handleAuthError(error);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  getCustomSupplies(): CustomSupply[] {
    return this.customSupplies();
  }

  getCustomSupplyById(id: string): CustomSupply | undefined {
    return this.customSupplies().find((supply) => supply.id === id);
  }

  createCustomSupply(request: CustomSupplyRequest): Observable<CustomSupply> {
    const params = new HttpParams().set('accountId', request.accountId);
    const body = this.toCustomSupplyFormData(request, true);

    return this.http.post<CustomSupplyResponse>(CUSTOM_SUPPLY_ENDPOINT, body, { params }).pipe(
      map((res: CustomSupplyResponse) => assembleCustomSupply(res)),
      tap(() => {
        this.loadCustomSuppliesByAccount(request.accountId);
      }),
    );
  }

  updateCustomSupply(id: string, request: CustomSupplyRequest): Observable<CustomSupply> {
    const body = this.toCustomSupplyFormData(request, false);

    return this.http.patch<CustomSupplyResponse>(`${CUSTOM_SUPPLY_ENDPOINT}/${id}`, body).pipe(
      map((res: CustomSupplyResponse) => assembleCustomSupply(res)),
      tap((updated) => {
        const current = this.customSupplies();
        const index = current.findIndex((supply) => supply.id === id);

        if (index !== -1) {
          const nextSupplies = [...current];
          nextSupplies[index] = updated;
          this.customSupplies.set(nextSupplies);
        }
      }),
    );
  }

  deleteCustomSupply(id: string): Observable<void> {
    return this.http.delete<void>(`${CUSTOM_SUPPLY_ENDPOINT}/${id}`).pipe(
      tap(() => {
        this.customSupplies.update((current) => current.filter((supply) => supply.id !== id));
      }),
    );
  }

  loadSupplyTemplates(): void {
    this.http
      .get<SupplyResponse[]>(SUPPLY_ENDPOINT)
      .pipe(
        tap((responses: SupplyResponse[]) => {
          this.supplyTemplates.set(responses.map(assembleSupply));
        }),
      )
      .subscribe();
  }

  getSupplyTemplates(): Supply[] {
    return this.supplyTemplates();
  }

  private fetchCustomSuppliesByAccount(accountId: string): Observable<CustomSupply[]> {
    const params = new HttpParams().set('accountId', accountId);

    return this.http
      .get<AccountCustomSuppliesResponse | CustomSupplyResponse[]>(CUSTOM_SUPPLY_ENDPOINT, { params })
      .pipe(
        map((response) => {
          const supplies = Array.isArray(response) ? response : response.supplies;
          return supplies.map(assembleCustomSupply);
        }),
      );
  }

  private handleAuthError(error: any): void {
    if (error.status === 401) {
      this.router.navigate(['/login']);
    }
  }

  private toCustomSupplyFormData(request: CustomSupplyRequest, includeSupplyId: boolean): FormData {
    const body = new FormData();
    body.append('name', request.name);
    if (includeSupplyId) body.append('supplyId', request.supplyId);
    body.append('minimumStock', String(request.minimumStock));
    body.append('maximumStock', String(request.maximumStock ?? request.minimumStock));
    body.append('unitPrice', request.unitPrice);
    body.append('description', request.description);
    body.append('unitMeasurement', request.unitMeasurement);
    if (request.image) body.append('image', request.image);

    return body;
  }
}
