import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { KitsStore } from '../../../application/kits.store';
import { KitCardComponent } from '../../components/kit-card/kit-card';
import { CreateKitDialogComponent } from '../../components/create-kit-dialog/create-kit-dialog';

/**
 * KitsInventoryComponent
 * Main view for the kits catalog, featuring search and a grid of kit cards.
 * Designed to match the Figma SaaS-style layout.
 */
@Component({
  selector: 'app-kits-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    KitCardComponent,
    MatDialogModule,

  ],
  templateUrl: './kits-inventory.html',
  styleUrls: ['./kits-inventory.css'],
})
export class KitsInventoryComponent implements OnInit {
  private readonly kitsStore = inject(KitsStore);
  private readonly dialog = inject(MatDialog);

  // Search state
  searchTerm = signal<string>('');

  // Store signals
  readonly isLoading = this.kitsStore.loading;

  // Filtered kits based on search term
  readonly filteredKits = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.kitsStore
      .kits()
      .filter(
        (kit) =>
          kit.name.toLowerCase().includes(term) || kit.description.toLowerCase().includes(term),
      );
  });

  // Stats
  readonly totalKits = computed(() => this.kitsStore.kits().length);
  readonly activeCombos = computed(() => this.kitsStore.kits().filter(k => k.status === 'Active').length);
  readonly lowStockAlerts = signal(12); // TODO: compute based on data

  ngOnInit(): void {
    this.kitsStore.loadKits();
  }

  trackByKitId(index: number, kit: any): string {
    return kit.id;
  }

  /**
   * Navigates to the creation flow.
   */
  onAddKit(): void {
    const dialogRef = this.dialog.open(CreateKitDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.kitsStore.loadKits();
    });
  }
}
