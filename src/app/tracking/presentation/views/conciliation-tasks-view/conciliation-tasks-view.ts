import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TrackingStore } from '../../../application/tracking.store';
import { TRACKING_PATHS } from '../../tracking-paths';

/**
 * Conciliation Tasks view displaying active inventory discrepancies.
 *
 * Lists all active discrepancies between digital and physical stock records,
 * with filtering, severity badges, and action menus.
 */
@Component({
  selector: 'app-conciliation-tasks-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conciliation-tasks-view.html',
  styleUrl: './conciliation-tasks-view.css',
})
export class ConciliationTasksView implements OnInit {
  readonly store = inject(TrackingStore);
  readonly historyPath = TRACKING_PATHS.discrepancies.history;

  filterSeverity = 'ALL';

  ngOnInit(): void {
    this.store.loadDiscrepancies();
  }

  get filteredDiscrepancies() {
    const all = this.store.discrepancies();
    if (this.filterSeverity === 'ALL') return all;
    return all.filter((d) => d.severity === this.filterSeverity);
  }

  setFilter(severity: string): void {
    this.filterSeverity = severity;
  }

  getSeverityClass(severity: string): string {
    if (severity === 'CRITICAL') return 'badge-critical';
    if (severity === 'HIGH' || severity === 'WARNING') return 'badge-warning';
    return 'badge-low';
  }

  getSeverityLabel(severity: string): string {
    if (severity === 'CRITICAL') return 'CRITICAL';
    if (severity === 'HIGH') return 'WARNING';
    return severity;
  }
}
