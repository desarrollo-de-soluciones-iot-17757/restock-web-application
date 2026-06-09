import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrackingStore } from '../../../application/tracking.store';

const DISCREPANCY_CAUSES = [
  'WASTE/SPOILAGE',
  'THEFT/LOSS',
  'UNREGISTERED USE',
  'TRANSFER/DISPLAY',
  'SENSOR FAULT',
] as const;

const CAUSE_INFO: Record<string, string> = {
  'WASTE/SPOILAGE':
    'Stock has been damaged, expired, or spoiled. The system will adjust the digital inventory to match the physical count.',
  'THEFT/LOSS':
    'Stock has been taken without registration or is otherwise missing. A loss adjustment will be applied.',
  'UNREGISTERED USE':
    'Stock was used without being properly registered in the system. Inventory will be reconciled accordingly.',
  'TRANSFER/DISPLAY':
    'Stock was moved to a display area or transferred between storage units without updating the system.',
  'SENSOR FAULT':
    'The discrepancy was caused by a sensor reading error. The digital stock will be preserved and the sensor flagged for review.',
};

/**
 * Resolve Stock Discrepancy dialog.
 *
 * Allows the user to select the cause of a stock discrepancy, view
 * contextual guidance, provide justification, and confirm resolution.
 */
@Component({
  selector: 'app-resolve-discrepancy-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resolve-discrepancy-dialog.html',
  styleUrl: './resolve-discrepancy-dialog.css',
})
export class ResolveDiscrepancyDialog {
  @Output() onClose = new EventEmitter<void>();
  @Output() onResolve = new EventEmitter<void>();

  readonly store = inject(TrackingStore);

  readonly causes = DISCREPANCY_CAUSES;

  selectedCause = signal<string>('');
  justification = '';

  get causeInfo(): string {
    return CAUSE_INFO[this.selectedCause()] ?? '';
  }

  cancel(): void {
    this.onClose.emit();
  }

  confirm(): void {
    this.store.resolveDiscrepancy('', this.selectedCause(), this.justification);
    this.onResolve.emit();
  }
}
