import { signal, computed, Injectable } from '@angular/core';
import { Metric } from '../domain/model/metric.entity';

@Injectable({ providedIn: 'root' })
export class AnalyticsStore {
  readonly metrics = signal<Metric[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedRange = signal<'7d' | '30d' | '90d'>('7d');

  loadMetrics(range: '7d' | '30d' | '90d'): void {
    this.selectedRange.set(range);
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 500);
  }
}
