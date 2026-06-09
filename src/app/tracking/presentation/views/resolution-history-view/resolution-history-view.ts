import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TrackingStore } from '../../../application/tracking.store';
import { TRACKING_PATHS } from '../../tracking-paths';

type HistoryTab = 'resolved' | 'pending' | 'archived';

/**
 * Resolution History view showing past conciliation task outcomes.
 *
 * Displays summary KPIs, tabbed history table with deviation and reason
 * badges, and a top resolution reasons chart placeholder.
 */
@Component({
  selector: 'app-resolution-history-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resolution-history-view.html',
  styleUrl: './resolution-history-view.css',
})
export class ResolutionHistoryView implements OnInit {
  readonly store = inject(TrackingStore);
  readonly discrepanciesPath = TRACKING_PATHS.discrepancies.root;

  activeTab = signal<HistoryTab>('resolved');

  ngOnInit(): void {
    this.store.loadResolutionHistory();
  }

  setTab(tab: HistoryTab): void {
    this.activeTab.set(tab);
  }

  getDeviationClass(deviation: number): string {
    if (deviation < 0) return 'deviation-negative';
    if (deviation > 0) return 'deviation-positive';
    return 'deviation-sensor-fault';
  }

  getReasonClass(reason: string): string {
    switch (reason) {
      case 'WASTE/SPOILAGE':
        return 'reason-spoilage';
      case 'THEFT/LOSS':
        return 'reason-theft';
      case 'UNREGISTERED USE':
        return 'reason-unregistered';
      case 'TRANSFER/DISPLAY':
        return 'reason-transfer';
      case 'SENSOR FAULT':
        return 'reason-sensor';
      default:
        return 'reason-default';
    }
  }

  get filteredHistory() {
    return this.store.resolutionHistory();
  }
}
