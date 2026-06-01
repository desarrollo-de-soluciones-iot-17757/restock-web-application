import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceStore } from '../../../application/resource.store';
import { CustomSupply } from '../../../domain/model/custom-supply.entity';
import { CustomSupplyRequest } from '../../../infrastructure/custom-supply/custom-supply.response';

@Component({
  selector: 'app-edit-custom-supply-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-custom-supply-dialog.html',
  styleUrl: './edit-custom-supply-dialog.css'
})
export class EditCustomSupplyDialogComponent implements OnInit {
  @Input({ required: true }) customSupply!: CustomSupply;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<void>();

  private readonly store = inject(ResourceStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly supplyTemplates = this.store.supplyTemplates;
  
  formData = {
    categoryId: '',
    supplyId: '',
    name: '',
    unitMeasurement: '',
    minimumStock: null as number | null,
    maximumStock: null as number | null,
    description: '',
    unitPriceAmount: '',
    unitPriceCurrencyCode: 'PEN',
    supplyContent: 1,
    imageUrl: ''
  };

  private originalDataStr = '';

  ngOnInit(): void {
    this.store.loadSupplyTemplates();
    this.formData = {
      categoryId: this.customSupply.category,
      supplyId: this.customSupply.supply.id,
      name: this.customSupply.name,
      unitMeasurement: this.customSupply.unit.abbreviation,
      minimumStock: this.customSupply.minStock,
      maximumStock: this.customSupply.maxStock,
      description: this.customSupply.supply.description,
      unitPriceAmount: this.customSupply.unitPrice.toString(),
      unitPriceCurrencyCode: 'PEN',
      supplyContent: 1,
      imageUrl: this.customSupply.imgUrl
    };
    this.originalDataStr = JSON.stringify(this.formData);
  }

  hasUnsavedChanges(): boolean {
    return this.originalDataStr !== JSON.stringify(this.formData);
  }

  get uniqueCategories(): string[] {
    const templates = this.supplyTemplates();
    return [...new Set(templates.map(t => t.category))];
  }

  get isPerishable(): boolean {
    if (!this.formData.supplyId) return false;
    const supply = this.supplyTemplates().find(s => s.id === this.formData.supplyId);
    return supply?.perishable ?? false;
  }

  get selectedSupplyName(): string {
    const supply = this.supplyTemplates().find(s => s.id === this.formData.supplyId);
    return supply?.name ?? this.customSupply.name;
  }

  cancel(): void {
    this.onClose.emit();
  }

  update(): void {
    const request: CustomSupplyRequest = {
      accountId: this.customSupply.accountId,
      supplyId: this.customSupply.supply.id,
      name: this.formData.name || this.selectedSupplyName,
      description: this.formData.description,
      categoryName: this.formData.categoryId,
      unitPrice: `${this.formData.unitPriceAmount} ${this.formData.unitPriceCurrencyCode}`,
      supplyContent: this.formData.supplyContent,
      unitMeasurement: this.formData.unitMeasurement,
      minimumStock: this.formData.minimumStock ?? 0,
      pictureUrl: this.formData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80.jpg'
    };

    this.store.updateCustomSupply(this.customSupply.id, request).subscribe(() => {
      this.originalDataStr = JSON.stringify(this.formData);
      this.onUpdate.emit();
      this.onClose.emit();
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }
}
