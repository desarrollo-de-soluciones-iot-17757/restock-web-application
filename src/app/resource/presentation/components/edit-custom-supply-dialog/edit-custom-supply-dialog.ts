import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceStore } from '../../../application/resource.store';
import { CustomSupply } from '../../../domain/model/custom-supply.entity';

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

  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;

  formData = {
    categoryId: '',
    supplyId: '',
    name: '',
    unitMeasurement: '',
    minimumStock: null as number | null,
    maximumStock: null as number | null,
    description: '',
    unitPriceAmount: null as number | null,
    unitPriceCurrencyCode: 'PEN',
  };

  private originalDataStr = '';

  ngOnInit(): void {
    this.store.loadSupplyTemplates();
    this.formData = {
      categoryId: this.customSupply.supply.category,
      supplyId: this.customSupply.supply.id,
      name: this.customSupply.name,
      unitMeasurement: this.customSupply.unit.abbreviation,
      minimumStock: this.customSupply.minStock,
      maximumStock: this.customSupply.maxStock,
      description: this.customSupply.supply.description,
      unitPriceAmount: this.customSupply.unitPrice,
      unitPriceCurrencyCode: 'PEN',
    };
    this.imagePreviewUrl = this.customSupply.imgUrl || null;
    this.originalDataStr = JSON.stringify(this.formData);
  }

  hasUnsavedChanges(): boolean {
    return this.originalDataStr !== JSON.stringify(this.formData);
  }

  get uniqueCategories(): string[] {
    return [...new Set(this.supplyTemplates().map(t => t.category))];
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      this.readImagePreview(file);
    }
  }

  private readImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.onClose.emit();
  }

  update(): void {
    const unitPrice = `${this.formData.unitPriceAmount ?? 0} ${this.formData.unitPriceCurrencyCode}`;

    const fd = new FormData();
    fd.append('name', this.formData.name);
    fd.append('description', this.formData.description);
    fd.append('minimumStock', String(this.formData.minimumStock ?? 0));
    fd.append('maximumStock', String(this.formData.maximumStock ?? 0));
    fd.append('unitPrice', unitPrice);
    fd.append('unitMeasurement', this.formData.unitMeasurement);
    if (this.selectedImageFile) {
      fd.append('image', this.selectedImageFile, this.selectedImageFile.name);
    }

    this.store.updateCustomSupply(this.customSupply.id, fd, this.customSupply.accountId).subscribe(() => {
      this.originalDataStr = JSON.stringify(this.formData);
      this.onUpdate.emit();
      this.onClose.emit();
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }
}

