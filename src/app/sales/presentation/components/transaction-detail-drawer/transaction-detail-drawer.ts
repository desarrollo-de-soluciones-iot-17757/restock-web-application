import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderEntity } from '../../../domain/model/sales-order.entity';
import { KitStore } from '../../../../planning/kits/application/kits.store';

/**
 * Slide-in drawer with the sold items + the inventory deduction log for a
 * single, already-completed sales order. Purely presentational: receives
 * the order to render and emits `close`.
 */
@Component({
  selector: 'app-transaction-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail-drawer.html',
  styleUrl: './transaction-detail-drawer.css',
})
export class TransactionDetailDrawerComponent {
  @Input() order: SalesOrderEntity | null = null;
  @Output() close = new EventEmitter<void>();

  private readonly kitsStore = inject(KitStore);

  constructor() {
    this.kitsStore.loadAllKits();
  }

  getKitImage(productId: string): string | null {
    const kit = this.kitsStore.kits().find((k) => k.id === productId || k.sku === productId);
    return kit ? kit.imageUrl : null;
  }

  /** Flattens every consumed batch across every item into one deduction log. */
  get deductionLog(): { label: string; time: string }[] {
    const order = this.order;
    if (!order) return [];
    const log: { label: string; time: string }[] = [];
    for (const item of order.items) {
      for (const ingredient of item.ingredientsResolved) {
        for (const batch of ingredient.batchesReserved) {
          log.push({
            label: `Deducted: ${item.nameSnapshot} (-${batch.quantityToConsume} unit) from Batch ${batch.batchId.slice(0, 6).toUpperCase()}`,
            time: order.createdAt ? order.createdAt.slice(11, 16) : '',
          });
        }
      }
    }
    return log;
  }

  statusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'status-logged';
      case 'CANCELLED':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'LOGGED';
      case 'CANCELLED':
        return 'FAILED SYNC';
      default:
        return 'PENDING';
    }
  }
}
