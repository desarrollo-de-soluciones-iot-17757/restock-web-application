import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceStore } from '../../../application/resource.store';
import { IamStore as AuthService } from '../../../../iam/application/iam.store';
import { RESOURCE_PATHS } from '../../../infrastructure/resource-paths.registry';

@Component({
  selector: 'app-create-custom-supply-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-custom-supply-dialog.html',
  styleUrl: './create-custom-supply-dialog.css'
})
export class CreateCustomSupplyDialogComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<void>();

  private readonly store = inject(ResourceStore);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

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
    isPerishable: false,
    description: '',
    unitPriceAmount: null as number | null,
    unitPriceCurrencyCode: 'PEN',
    supplyContent: null as number | null,
    imageUrl: '',
  };

  ngOnInit(): void {
    this.store.loadSupplyTemplates();
  }

  get uniqueCategories(): string[] {
    return [...new Set(this.supplyTemplates().map(t => t.category))];
  }

  get selectedSupplyName(): string {
    const supply = this.supplyTemplates().find(s => s.id === this.formData.supplyId);
    return supply?.name ?? '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      this.readImagePreview(file);
    }
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
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

  create(): void {
    const user = this.authService.currentUser();
    const accountId = user?.accountId ?? '';

    const fd = new FormData();
    fd.append('accountId', accountId);
    fd.append('supplyId', this.formData.supplyId);
    fd.append('name', this.formData.name || this.selectedSupplyName);
    fd.append('description', this.formData.description);
    fd.append('unitPrice', String(this.formData.unitPriceAmount ?? 0));
    fd.append('unitPriceCurrencyCode', this.formData.unitPriceCurrencyCode);
    fd.append('supplyContent', String(this.formData.supplyContent ?? 0));
    fd.append('unitMeasurement', this.formData.unitMeasurement);
    if (this.selectedImageFile) {
      fd.append('image', this.selectedImageFile, this.selectedImageFile.name);
    }

    this.store.createCustomSupply(fd, accountId).subscribe((newSupply) => {
      this.onCreate.emit();
      this.onClose.emit();
      this.router.navigate([RESOURCE_PATHS.customSupplies.detail(newSupply.id)]);
    });
  }
}


