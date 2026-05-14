import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitsStore } from '../../../application/kits.store';
import { KitCardComponent } from '../kit-card/kit-card';

/**
 * KitsInventoryComponent
 * Main view for the kits catalog, featuring search and a grid of kit cards.
 * Designed to match the Figma SaaS-style layout.
 */
@Component({
  selector: 'app-kits-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, KitCardComponent],
  templateUrl: './kits-inventory.html',
  styleUrls: ['./kits-inventory.css'],
})
export class KitsInventoryComponent implements OnInit {
  private readonly kitsStore = inject(KitsStore);

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
    console.log('Redirecting to create kit flow...');
  }
}
