import { Injectable, signal, inject } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { ResourceApi } from '../infrastructure/resource-api';
import type { BatchData, BatchRow } from '../infrastructure/batch/batch.assembler';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CustomSupply } from '../domain/model/custom-supply.entity';
import { Supply } from '../domain/model/supply.entity';
import { AccountCustomSuppliesResponse, CustomSupplyResponse } from '../infrastructure/custom-supply/custom-supply.response';
import { SupplyResponse } from '../infrastructure/supply/supply.response';
import { assembleCustomSupply } from '../infrastructure/custom-supply/custom-supply.assembler';
import { assembleSupply } from '../infrastructure/supply/supply.assembler';
import { CUSTOM_SUPPLY_ENDPOINT, ACCOUNT_CUSTOM_SUPPLIES_ENDPOINT } from '../infrastructure/custom-supply/custom-supply.endpoint';
import { SUPPLY_ENDPOINT } from '../infrastructure/supply/supply.endpoint';

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

  readonly customSupplies = signal<CustomSupply[]>([]);
  readonly supplyTemplates = signal<Supply[]>([]);

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

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

  loadCustomSuppliesByAccount(accountId: string): void {
    if (!accountId) {
      console.warn('[ResourceStore] loadCustomSuppliesByAccount called with empty accountId');
      return;
    }
    this.loading.set(true);
    this.http.get<AccountCustomSuppliesResponse>(ACCOUNT_CUSTOM_SUPPLIES_ENDPOINT(accountId)).pipe(
      tap((response: AccountCustomSuppliesResponse) => {
        // The account-level response has accountId at the root; individual supply items
        // don't include it, so we inject it from the parent response.
        const assembled = response.supplies.map((dto) => {
          try {
            return assembleCustomSupply({ ...dto, accountId: response.accountId });
          } catch (e) {
            console.error('[ResourceStore] Failed to assemble custom supply', dto, e);
            return null;
          }
        }).filter((s): s is CustomSupply => s !== null);
        this.customSupplies.set(assembled);
      }),
      catchError((error: any) => {
        console.error('[ResourceStore] loadCustomSuppliesByAccount error', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        this.loadError.set(true);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  getCustomSupplies(): CustomSupply[] {
    return this.customSupplies();
  }

  getCustomSupplyById(id: string): CustomSupply | undefined {
    return this.customSupplies().find(supply => supply.id === id);
  }

  createCustomSupply(formData: FormData, accountId: string): Observable<CustomSupply> {
    return this.http.post<CustomSupplyResponse>(CUSTOM_SUPPLY_ENDPOINT, formData).pipe(
      map((res: CustomSupplyResponse) => assembleCustomSupply(res)),
      tap((newSupply) => {
        // Reload the full list so the new item has the proper supply/accountId populated
        this.loadCustomSuppliesByAccount(accountId);
      })
    );
  }

  updateCustomSupply(id: string, formData: FormData, accountId: string): Observable<CustomSupply> {
    return this.http.put<CustomSupplyResponse>(`${CUSTOM_SUPPLY_ENDPOINT}/${id}`, formData).pipe(
      map((res: CustomSupplyResponse) => assembleCustomSupply(res)),
      tap((updated) => {
        const current = this.customSupplies();
        const index = current.findIndex(s => s.id === id);
        if (index !== -1) {
          const newSupplies = [...current];
          newSupplies[index] = updated;
          this.customSupplies.set(newSupplies);
        }
      })
    );
  }

  deleteCustomSupply(id: string): Observable<void> {
    return this.http.delete<void>(`${CUSTOM_SUPPLY_ENDPOINT}/${id}`).pipe(
      tap(() => {
        const current = this.customSupplies();
        this.customSupplies.set(current.filter(s => s.id !== id));
      })
    );
  }

  loadSupplyTemplates(): void {
    this.http.get<SupplyResponse[]>(SUPPLY_ENDPOINT).pipe(
      tap((responses: SupplyResponse[]) => {
        this.supplyTemplates.set(responses.map(assembleSupply));
      })
    ).subscribe();
  }

  getSupplyTemplates(): Supply[] {
    return this.supplyTemplates();
  }
}
