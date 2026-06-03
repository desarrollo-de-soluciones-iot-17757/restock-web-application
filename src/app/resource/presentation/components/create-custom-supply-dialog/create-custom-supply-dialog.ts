import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceStore } from '../../../application/resource.store';
import { IamStore as AuthService } from '../../../../iam/application/iam.store';
import { CustomSupplyRequest } from '../../../infrastructure/custom-supply/custom-supply.response';
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

  private readonly DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80.jpg';

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
    unitPriceAmount: '0.00',
    unitPriceCurrencyCode: 'PEN',
    supplyContent: 1,
    imageUrl: ''
  };

  ngOnInit(): void {
    this.store.loadSupplyTemplates();
  }

  get uniqueCategories(): string[] {
    const templates = this.supplyTemplates();
    return [...new Set(templates.map(t => t.category))];
  }

  get selectedSupplyName(): string {
    const supply = this.supplyTemplates().find(s => s.id === this.formData.supplyId);
    return supply?.name ?? '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.readImageFile(file);
    }
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.readImageFile(file);
    }
  }

  private readImageFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl = e.target?.result as string;
      this.formData.imageUrl = this.imagePreviewUrl;
    };
    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.onClose.emit();
  }

  create(): void {
    const user = this.authService.currentUser();
    const accountId = (user as any)?.accountId ?? 'acc-123';

    const request: CustomSupplyRequest = {
      accountId,
      supplyId: this.formData.supplyId,
      name: this.formData.name || this.selectedSupplyName,
      description: this.formData.description,
      categoryName: this.formData.categoryId,
      unitPrice: `${this.formData.unitPriceAmount} ${this.formData.unitPriceCurrencyCode}`,
      supplyContent: this.formData.supplyContent,
      unitMeasurement: this.formData.unitMeasurement,
      minimumStock: this.formData.minimumStock ?? 0,
      pictureUrl: this.formData.imageUrl?.trim() || this.DEFAULT_IMAGE_URL
    };

    this.store.createCustomSupply(request).subscribe((newSupply) => {
      this.onCreate.emit();
      this.onClose.emit();
      this.router.navigate([RESOURCE_PATHS.customSupplies.detail(newSupply.id)]);
    });
  }
}

