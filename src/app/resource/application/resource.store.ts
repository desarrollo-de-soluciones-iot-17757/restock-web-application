import { Injectable, signal, inject } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { ResourceApi } from '../infrastructure/resource-api';
import type { BatchData, BatchRow } from '../infrastructure/batch/batch.assembler';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CustomSupply } from '../domain/model/custom-supply.entity';
import { Supply } from '../domain/model/supply.entity';
import { CustomSupplyResponse, CustomSupplyListResponse } from '../infrastructure/custom-supply/custom-supply.response';
import { SupplyResponse } from '../infrastructure/supply/supply.response';
import { assembleCustomSupply } from '../infrastructure/custom-supply/custom-supply.assembler';
import { assembleSupply } from '../infrastructure/supply/supply.assembler';
import {
  CUSTOM_SUPPLIES_BY_ACCOUNT_URL,
  CREATE_CUSTOM_SUPPLY_URL,
  UPDATE_CUSTOM_SUPPLY_URL,
  DELETE_CUSTOM_SUPPLY_URL,
} from '../infrastructure/custom-supply/custom-supply.endpoint';
import { SUPPLY_ENDPOINT, SUPPLY_CATEGORIES_URL } from '../infrastructure/supply/supply.endpoint';

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
  readonly supplyCategories = signal<string[]>([]);

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  constructor(private readonly resourceApi: ResourceApi) {}

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
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadSupplyTemplates(): void {
    this.http
      .get<SupplyResponse[]>(SUPPLY_ENDPOINT)
      .pipe(
        tap((responses) => this.supplyTemplates.set(responses.map(assembleSupply))),
        catchError((err) => {
          console.error('[ResourceStore] loadSupplyTemplates error', err);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  loadSupplyCategories(): void {
    this.http
      .get<string[]>(SUPPLY_CATEGORIES_URL)
      .pipe(
        tap((categories) => this.supplyCategories.set(categories)),
        catchError((err) => {
          console.error('[ResourceStore] loadSupplyCategories error', err);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  getSupplyTemplates(): Supply[] {
    return this.supplyTemplates();
  }


  loadCustomSuppliesByAccount(accountId: string): void {
    if (!accountId) {
      console.warn('[ResourceStore] loadCustomSuppliesByAccount called with empty accountId');
      return;
    }
    this.loading.set(true);
    this.http
      .get<CustomSupplyListResponse>(CUSTOM_SUPPLIES_BY_ACCOUNT_URL(accountId))
      .pipe(
        tap((list) => {
          const assembled = list
            .map((dto) => {
              try {
                return assembleCustomSupply(dto);
              } catch (e) {
                console.error('[ResourceStore] Failed to assemble custom supply', dto, e);
                return null;
              }
            })
            .filter((s): s is CustomSupply => s !== null);
          this.customSupplies.set(assembled);
        }),
        catchError((error: any) => {
          console.error('[ResourceStore] loadCustomSuppliesByAccount error', error);
          if (error.status === 401) {
            this.router.navigate(['/sign-in']);
          }
          this.loadError.set(true);
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
    return this.customSupplies().find((s) => s.id === id);
  }
  createCustomSupply(formData: FormData, accountId: string): Observable<CustomSupply> {
    return this.http
      .post<CustomSupplyResponse>(CREATE_CUSTOM_SUPPLY_URL(accountId), formData)
      .pipe(
        map((res) => assembleCustomSupply(res)),
        tap(() => this.loadCustomSuppliesByAccount(accountId)),
      );
  }

  updateCustomSupply(
    customSupplyId: string,
    formData: FormData,
    accountId: string,
  ): Observable<CustomSupply> {
    return this.http
      .patch<CustomSupplyResponse>(UPDATE_CUSTOM_SUPPLY_URL(customSupplyId), formData)
      .pipe(
        map((res) => assembleCustomSupply(res)),
        tap((updated) => {
          const current = this.customSupplies();
          const index = current.findIndex((s) => s.id === customSupplyId);
          if (index !== -1) {
            const updated_list = [...current];
            updated_list[index] = updated;
            this.customSupplies.set(updated_list);
          }
        }),
      );
  }

  deleteCustomSupply(customSupplyId: string, accountId: string): Observable<void> {
    return this.http
      .delete<void>(DELETE_CUSTOM_SUPPLY_URL(customSupplyId))
      .pipe(
        tap(() => {
          this.customSupplies.set(
            this.customSupplies().filter((s) => s.id !== customSupplyId),
          );
        }),
      );
  }

}
