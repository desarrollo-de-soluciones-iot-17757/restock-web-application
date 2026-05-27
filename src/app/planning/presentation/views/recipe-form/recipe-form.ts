import { Component, inject, input, output, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KitItem } from '../../../domain/model/kit-item.entity';
import { RegisterKitCommand } from '../../../domain/model/register-kit.command';
import { KitsStore } from '../../../application/kits.store'; // ◄ Importa tu comando

@Component({
  selector: 'app-kit-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class KitFormModalComponent implements OnInit {
  public readonly kitsStore = inject(KitsStore);

  isOpen = input.required<boolean>();
  closeModal = output<void>();

  kitName = signal<string>('');
  kitPrice = signal<number>(0);

  // Mapeos limpios que se usan en los combos de la UI
  readonly availableProducts = this.kitsStore.products;
  readonly loadingProducts = this.kitsStore.loadingProducts;
  selectedProductId = signal<string>('');
  inputQuantity = signal<number>(1);

  includedProducts = signal<KitItem[]>([]);

  constructor() {
    effect(() => {
      if (this.isOpen() && this.availableProducts().length > 0 && !this.selectedProductId()) {
        this.selectedProductId.set(this.availableProducts()[0].id);
      }
    });
  }

  ngOnInit(): void {
    this.kitsStore.loadAllProducts();
  }

  addSupply(): void {
    const targetProduct = this.availableProducts().find((p) => p.id === this.selectedProductId());
    if (!targetProduct) return;

    try {
      const newItem = new KitItem({
        id: targetProduct.id,
        name: targetProduct.name,
        sku: targetProduct.sku,
        price: targetProduct.price,
        quantity: this.inputQuantity(),
      });

      const existingItem = this.includedProducts().find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.changeQuantity(existingItem.quantity + newItem.quantity);
        this.includedProducts.update((list) => [...list]);
      } else {
        this.includedProducts.update((list) => [...list, newItem]);
      }
      this.inputQuantity.set(1);
    } catch (error: any) {
      alert(error.message);
    }
  }

  removeProduct(index: number): void {
    this.includedProducts.update((products) => products.filter((_, i) => i !== index));
  }

  onClose(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  onSave(): void {
    if (!this.kitName().trim()) {
      alert('Por favor, ingresa el nombre del Kit.');
      return;
    }
    if (this.includedProducts().length === 0) {
      alert('Debes incluir al menos un producto en el Kit.');
      return;
    }

    const command = new RegisterKitCommand({
      name: this.kitName(),
      price: this.kitPrice(),
      description: 'Kit automático generado desde el planificador',
      imageUrl: 'https://placehold.co/209x201',
      items: this.includedProducts(),
    });

    this.kitsStore.registerKit(command, () => {
      this.resetForm();
      this.closeModal.emit();
    });
  }

  private resetForm(): void {
    this.includedProducts.set([]);
    this.kitName.set('');
    this.kitPrice.set(0);
    this.inputQuantity.set(1);
  }
}
