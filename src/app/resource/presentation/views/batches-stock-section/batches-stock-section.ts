import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { ResourceStore } from '../../../application/resource.store';
import type { BatchRow } from '../../../infrastructure/batch/batch.assembler';
import {
  BatchStockTableComponent,
  type StockLevelFilter,
} from '../../components/batch-stock-table/batch-stock-table';

type CategoryFilter = string;

/**
 * Resource view responsible for displaying the batch stock section.
 *
 * This view owns screen state, filters and pagination logic, while delegating
 * the table rendering to a presentation component.
 */
@Component({
  selector: 'app-batches-stock-section',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, DecimalPipe, TranslatePipe, BatchStockTableComponent, RouterLink],
  templateUrl: './batches-stock-section.html',
  styleUrl: './batches-stock-section.css',
})
export class BatchesStockSection {
  private readonly store = inject(ResourceStore);

  protected readonly loading = this.store.loading;
  protected readonly loadError = this.store.loadError;

  protected readonly totalActiveBatches = this.store.totalActiveBatches;
  protected readonly totalActiveBatchesDeltaPercent = this.store.totalActiveBatchesDeltaPercent;
  protected readonly nearExpiry30Days = this.store.nearExpiry30Days;
  protected readonly rows = this.store.rows;

  protected readonly categoryFilter = signal<CategoryFilter>('all');
  protected readonly stockLevelFilter = signal<StockLevelFilter>('any');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = 10;

  constructor() {
    this.store.refreshBatch();

    effect(() => {
      const pages = this.pageCount();

      if (pages === 0) {
        this.pageIndex.set(0);
        return;
      }

      if (this.pageIndex() > pages - 1) {
        this.pageIndex.set(pages - 1);
      }
    });
  }

  protected readonly categories = computed(() => {
    const set = new Set(this.rows().map((row) => row.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  protected readonly filteredRows = computed(() => {
    const category = this.categoryFilter();
    const stockLevel = this.stockLevelFilter();

    return this.rows().filter((row) => {
      if (category !== 'all' && row.category !== category) return false;
      if (stockLevel === 'any') return true;

      return this.stockLevelOf(row) === stockLevel;
    });
  });

  protected readonly totalFiltered = computed(() => this.filteredRows().length);

  protected readonly pageCount = computed(() => {
    const total = this.totalFiltered();

    if (total === 0) return 0;

    return Math.ceil(total / this.pageSize);
  });

  protected readonly pagedRows = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  protected readonly pageNumbers = computed(() => {
    const total = this.pageCount();

    if (total === 0) return [];

    const current = this.pageIndex();
    const windowSize = Math.min(3, total);
    const start = Math.max(0, Math.min(current - 1, total - windowSize));

    return Array.from({ length: windowSize }, (_, index) => start + index);
  });

  protected readonly paginationFooter = computed(() => {
    const totalFiltered = this.totalFiltered();
    const totalPlatformBatches = this.totalActiveBatches();

    if (totalFiltered === 0) {
      return {
        mode: 'empty' as const,
        total: totalPlatformBatches,
      };
    }

    return {
      mode: 'range' as const,
      from: this.pageIndex() * this.pageSize + 1,
      to: Math.min((this.pageIndex() + 1) * this.pageSize, totalFiltered),
      total: totalPlatformBatches,
    };
  });

  protected onCategoryChange(value: string): void {
    this.categoryFilter.set(value);
    this.pageIndex.set(0);
  }

  protected onStockLevelChange(value: StockLevelFilter): void {
    this.stockLevelFilter.set(value);
    this.pageIndex.set(0);
  }

  protected goPage(index: number): void {
    const totalPages = this.pageCount();

    if (totalPages === 0) return;

    const max = totalPages - 1;
    const next = Math.max(0, Math.min(max, index));

    this.pageIndex.set(next);
  }

  private stockLevelOf(row: BatchRow): 'low' | 'ok' | 'high' {
    if (row.stock < row.minStock) return 'low';
    if (row.stock > row.maxStock) return 'high';

    return 'ok';
  }
}
