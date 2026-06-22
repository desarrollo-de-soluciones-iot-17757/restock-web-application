import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrackingStore } from '../../../application/tracking.store';
import { IamStore } from '../../../../iam/application/iam.store';

// The 3 actions the user can choose (AUTOMATIC_CLOSE is system-only)
export type ResolutionAction =
  | 'ADJUST_DIGITAL_STOCK'
  | 'UPDATE_JUSTIFIED_WITHDRAWN_STOCK'
  | 'RECALIBRATE_DEVICE';

const ACTION_LABELS: Record<ResolutionAction, string> = {
  ADJUST_DIGITAL_STOCK:
    'Adjust Digital Stock',
  UPDATE_JUSTIFIED_WITHDRAWN_STOCK:
    'Update Justified Withdrawn Stock',
  RECALIBRATE_DEVICE:
    'Recalibrate Device',
};

const ACTION_INFO: Record<ResolutionAction, string> = {
  ADJUST_DIGITAL_STOCK:
    'The digital stock will be aligned with the calculated total physical stock from the smart scale.',
  UPDATE_JUSTIFIED_WITHDRAWN_STOCK:
    'Confirm that stock exists outside the device (e.g. in use, on display) and update the justified withdrawn stock value.',
  RECALIBRATE_DEVICE:
    'The discrepancy was caused by a sensor or device problem. The device will be flagged for recalibration.',
};

const RESOLUTION_REASONS = [
  'WASTE_OR_SPOILAGE',
  'THEFT_OR_LOSS',
  'UNREGISTERED_USE',
  'TRANSFER_OR_DISPLAY',
  'SENSOR_FAULT',
] as const;

const REASON_LABELS: Record<string, string> = {
  WASTE_OR_SPOILAGE:   'Waste / Spoilage',
  THEFT_OR_LOSS:       'Theft / Loss',
  UNREGISTERED_USE:    'Unregistered Use',
  TRANSFER_OR_DISPLAY: 'Transfer / Display',
  SENSOR_FAULT:        'Sensor Fault',
};

@Component({
  selector: 'app-resolve-discrepancy-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resolve-discrepancy-dialog.html',
  styleUrl: './resolve-discrepancy-dialog.css',
})
export class ResolveDiscrepancyDialog implements OnInit {
  @Input({ required: true }) conciliationTaskId!: string;
  @Output() onClose = new EventEmitter<void>();
  @Output() onResolve = new EventEmitter<void>();

  readonly store = inject(TrackingStore);
  private readonly iamStore = inject(IamStore);

  readonly actions = Object.keys(ACTION_LABELS) as ResolutionAction[];
  readonly reasons = RESOLUTION_REASONS;
  readonly actionLabels = ACTION_LABELS;
  readonly actionInfo = ACTION_INFO;
  readonly reasonLabels = REASON_LABELS;

  selectedAction = signal<ResolutionAction | ''>('');
  selectedReason = signal<string>('');
  justification = '';
  newJustifiedWithdrawnStock: number | null = null;

  get task() {
    return this.store.selectedConciliationTask();
  }

  get showStockField(): boolean {
    return this.selectedAction() === 'UPDATE_JUSTIFIED_WITHDRAWN_STOCK';
  }

  get canConfirm(): boolean {
    if (!this.selectedAction()) return false;
    if (!this.selectedReason()) return false;
    return true;
  }

  ngOnInit(): void {
    this.store.loadConciliationTaskById(this.conciliationTaskId);
  }

  cancel(): void {
    this.onClose.emit();
  }

  confirm(): void {
    const userId = this.iamStore.currentUser()?.accountId ?? '';
    const action = this.selectedAction() as string;
    const withdrawnStock =
      action === 'UPDATE_JUSTIFIED_WITHDRAWN_STOCK'
        ? (this.newJustifiedWithdrawnStock ?? 0.0)
        : 0.0;

    this.store.resolveConciliationTask(this.conciliationTaskId, {
      resolvedByUserId: userId,
      resolutionAction: action,
      resolutionReason: this.selectedReason(),
      resolutionJustification: this.justification,
      newJustifiedWithdrawnStock: withdrawnStock,
    });
    this.onResolve.emit();
  }
}
