import { Injectable, signal, computed } from '@angular/core';
import { RecipeEntity } from '../domain/model/recipe.entity';
import { IngredientEntity } from '../domain/model/ingredient.entity';
import { RecipesApiEndpoint } from '../infrastructure/recipes-api-endpoint';
import { RecipesAssembler } from '../infrastructure/recipes.assembler';
import { CreateRecipeCommand, RecipeIngredientCommand } from '../domain/commands/create-recipe.command';
import { UpdateRecipeCommand } from '../domain/commands/update-recipe.command';

export type ModalMode = 'create' | 'edit' | null;

export interface RecipeFormIngredient {
  ingredient: IngredientEntity;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class RecipesStore {

  // ── STATE (signals) ──────────────────────────────────────────────
  readonly recipes        = signal<RecipeEntity[]>([]);
  readonly ingredients    = signal<IngredientEntity[]>([]);
  readonly selectedRecipe = signal<RecipeEntity | null>(null);
  readonly loading        = signal(false);
  readonly error          = signal<string | null>(null);
  readonly searchQuery    = signal('');

  // Modal state
  readonly modalMode      = signal<ModalMode>(null);
  readonly showDeleteModal = signal(false);
  readonly recipeToDelete  = signal<RecipeEntity | null>(null);

  // ── DERIVED ─────────────────────────────────────────────────────
  readonly filteredRecipes = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.recipes();
    return this.recipes().filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.sku.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  readonly metrics = computed(() => {
    const all = this.recipes();
    return {
      total: all.length,
      active: all.filter(r => r.status === 'ACTIVE').length,
      inactive: all.filter(r => r.status === 'INACTIVE').length,
      lowStock: all.filter(r => r.status === 'LOW STOCK').length,
    };
  });

  constructor(
    private readonly api: RecipesApiEndpoint,
    private readonly assembler: RecipesAssembler,
  ) {}

  // ── LOAD ─────────────────────────────────────────────────────────
  loadAll(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: resources => {
        this.recipes.set(this.assembler.toEntityList(resources));
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  loadIngredients(): void {
    this.api.getAllIngredients().subscribe({
      next: resources => {
        this.ingredients.set(this.assembler.ingredientListToEntities(resources));
      },
    });
  }

  selectRecipe(recipe: RecipeEntity): void {
    this.selectedRecipe.set(recipe);
  }

  // ── COST CALCULATION (local, before saving) ───────────────────────
  calculateEstimatedCost(formIngredients: RecipeFormIngredient[]): number {
    return formIngredients.reduce(
      (sum, fi) => sum + fi.ingredient.unitPrice * fi.quantity,
      0
    );
  }

  // ── CREATE ───────────────────────────────────────────────────────
  create(
    cmd: CreateRecipeCommand,
    formIngredients: RecipeFormIngredient[]
  ): void {
    const estimatedCost = this.calculateEstimatedCost(formIngredients);
    this.loading.set(true);
    this.api.create({ ...cmd, estimatedCost }).subscribe({
      next: resource => {
        const entity = this.assembler.toEntity(resource);
        this.recipes.update(list => [entity, ...list]);
        this.closeModal();
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // ── UPDATE ───────────────────────────────────────────────────────
  update(
    cmd: UpdateRecipeCommand,
    formIngredients: RecipeFormIngredient[]
  ): void {
    const estimatedCost = this.calculateEstimatedCost(formIngredients);
    this.loading.set(true);
    this.api.update({ ...cmd, estimatedCost }).subscribe({
      next: resource => {
        const entity = this.assembler.toEntity(resource);
        this.recipes.update(list =>
          list.map(r => (r.id === entity.id ? entity : r))
        );
        if (this.selectedRecipe()?.id === entity.id) {
          this.selectedRecipe.set(entity);
        }
        this.closeModal();
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // ── DELETE ───────────────────────────────────────────────────────
  confirmDelete(recipe: RecipeEntity): void {
    this.recipeToDelete.set(recipe);
    this.showDeleteModal.set(true);
  }

  executeDelete(): void {
    const recipe = this.recipeToDelete();
    if (!recipe) return;
    this.loading.set(true);
    this.api.delete(recipe.id).subscribe({
      next: () => {
        this.recipes.update(list => list.filter(r => r.id !== recipe.id));
        if (this.selectedRecipe()?.id === recipe.id) {
          this.selectedRecipe.set(null);
        }
        this.closeDeleteModal();
        this.closeModal();
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // ── MODAL CONTROLS ────────────────────────────────────────────────
  openCreateModal(): void {
    this.modalMode.set('create');
  }

  openEditModal(recipe: RecipeEntity): void {
    this.selectedRecipe.set(recipe);
    this.modalMode.set('edit');
  }

  closeModal(): void {
    this.modalMode.set(null);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.recipeToDelete.set(null);
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
