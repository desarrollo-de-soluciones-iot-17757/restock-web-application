import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges,
  SimpleChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeEntity } from '../../../../domain/model/recipe.entity';
import { IngredientEntity } from '../../../../domain/model/ingredient.entity';
import { CreateRecipeCommand } from '../../../../domain/commands/create-recipe.command';
import { UpdateRecipeCommand } from '../../../../domain/commands/update-recipe.command';
import { RecipeFormIngredient } from '../../../../application/recipes.store';

export interface RecipeModalSubmitEvent {
  cmd: CreateRecipeCommand | UpdateRecipeCommand;
  formIngredients: RecipeFormIngredient[];
}

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent implements OnInit, OnChanges {
  @Input() mode!: 'create' | 'edit';
  @Input() recipe: RecipeEntity | null = null;
  @Input() availableIngredients: IngredientEntity[] = [];

  @Output() onClose        = new EventEmitter<void>();
  @Output() onCreate       = new EventEmitter<RecipeModalSubmitEvent>();
  @Output() onUpdate       = new EventEmitter<RecipeModalSubmitEvent>();
  @Output() onDeleteRequest = new EventEmitter<RecipeEntity>();

  // Form fields
  name           = '';
  description    = '';
  imageUrl       = '';
  sku            = '';
  sellingPrice   = 0;

  // Ingredient constructor
  selectedIngredientId = '';
  ingredientQty        = 1;

  // Added ingredients
  formIngredients: RecipeFormIngredient[] = [];

  ngOnInit(): void {
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipe']) this.populateForm();
  }

  private populateForm(): void {
    if (this.mode === 'edit' && this.recipe) {
      this.name         = this.recipe.name;
      this.description  = this.recipe.description;
      this.imageUrl     = this.recipe.imageUrl;
      this.sku          = this.recipe.sku;
      this.sellingPrice = this.recipe.sellingPrice;
      this.formIngredients = this.recipe.ingredients.map(ri => ({
        ingredient: ri.ingredient,
        quantity: ri.quantity,
      }));
    } else {
      this.name = this.description = this.imageUrl = this.sku = '';
      this.sellingPrice = 0;
      this.formIngredients = [];
    }
  }

  get estimatedCost(): number {
    return this.formIngredients.reduce(
      (sum, fi) => sum + fi.ingredient.unitPrice * fi.quantity,
      0
    );
  }

  addIngredient(): void {
    if (!this.selectedIngredientId || this.ingredientQty <= 0) return;
    const ingredient = this.availableIngredients.find(i => i.id === this.selectedIngredientId);
    if (!ingredient) return;

    const existing = this.formIngredients.findIndex(fi => fi.ingredient.id === ingredient.id);
    if (existing >= 0) {
      this.formIngredients[existing].quantity += this.ingredientQty;
    } else {
      this.formIngredients = [
        ...this.formIngredients,
        { ingredient, quantity: this.ingredientQty }
      ];
    }
    this.selectedIngredientId = '';
    this.ingredientQty = 1;
  }

  removeIngredient(index: number): void {
    this.formIngredients = this.formIngredients.filter((_, i) => i !== index);
  }

  submit(): void {
    const ingredientCommands = this.formIngredients.map(fi => ({
      ingredientId: fi.ingredient.id,
      quantity: fi.quantity,
    }));

    if (this.mode === 'create') {
      const cmd: CreateRecipeCommand = {
        name: this.name,
        description: this.description,
        status: 'ACTIVE',
        imageUrl: this.imageUrl,
        sku: this.sku,
        sellingPrice: this.sellingPrice,
        ingredients: ingredientCommands,
      };
      this.onCreate.emit({ cmd, formIngredients: this.formIngredients });
    } else if (this.mode === 'edit' && this.recipe) {
      const cmd: UpdateRecipeCommand = {
        id: this.recipe.id,
        name: this.name,
        description: this.description,
        imageUrl: this.imageUrl,
        sku: this.sku,
        sellingPrice: this.sellingPrice,
        ingredients: ingredientCommands,
      };
      this.onUpdate.emit({ cmd, formIngredients: this.formIngredients });
    }
  }

  requestDelete(): void {
    if (this.recipe) this.onDeleteRequest.emit(this.recipe);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose.emit();
    }
  }
}
