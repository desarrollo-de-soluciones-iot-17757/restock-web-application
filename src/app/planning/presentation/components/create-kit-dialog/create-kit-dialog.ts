import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { KitsApi } from '../../../infrastructure/kits-api';
import { ProductsApi } from '../../../infrastructure/products-api';
import { RegisterKitCommand } from '../../../domain/model/register-kit.command';


@Component({
  selector: 'app-create-kit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './create-kit-dialog.html',
  styleUrls: ['./create-kit-dialog.css'],
})
export class CreateKitDialogComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateKitDialogComponent>);
  private document = inject(DOCUMENT);
  private kitsApi = inject(KitsApi);
  private productsApi = inject(ProductsApi);

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  kitForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [null],
    products: this.fb.array([]),
  });

  availableProducts: any[] = [];

  selectorForm: FormGroup = this.fb.group({
    selectedProductId: [''],
    quantity: [1],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsApi.getProducts().subscribe({
      next: (products: any[]) => {
        this.availableProducts = products;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
      },
    });
  }

  get productsFormArray(): FormArray {
    return this.kitForm.get('products') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  get totalCost(): number {
    return this.productsFormArray.controls.reduce((sum, control) => {
      const qty = control.get('quantity')?.value || 0;
      const price = control.get('price')?.value || 0;
      return sum + qty * price;
    }, 0);
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.kitForm.patchValue({
          image: this.imagePreview,
        });

        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileInput(): void {
    const input = this.document.getElementById('imageInput') as HTMLInputElement;
    input?.click();
  }

  addProduct(): void {
    const productId = this.selectorForm.get('selectedProductId')?.value;
    const quantity = this.selectorForm.get('quantity')?.value;

    if (productId) {
      const product = this.availableProducts.find((p) => p.id === productId);
      if (product) {
        const productForm = this.fb.group({
          productId: [productId],
          quantity: [quantity, [Validators.required, Validators.min(1)]],
          name: [product.name],
          sku: [product.sku],
          price: [product.price],
        });
        this.productsFormArray.push(productForm);
        this.selectorForm.reset({ quantity: 1 });
      }
    }
  }

  removeProduct(index: number): void {
    this.productsFormArray.removeAt(index);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.kitForm.valid) {
      const command = new RegisterKitCommand({
        name: this.kitForm.get('name')?.value,
        description: this.kitForm.get('description')?.value || '',
        price: this.kitForm.get('price')?.value,
        imageUrl: this.imagePreview || 'https://via.placeholder.com/150',
        items: this.productsFormArray.value.map((p: any) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      });

      this.kitsApi.createKit(command).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al crear el kit:', err);
        },
      });
    }
  }
}
