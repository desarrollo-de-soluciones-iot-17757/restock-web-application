import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipesStore } from '../../../application/recipes.store';
import { RecipeEntity } from '../../../domain/model/recipe.entity';
import { RecipeModalComponent } from '../../components/modals/recipe-modal/recipe-modal.component';
import { DeleteModalComponent } from '../../components/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-recipe-builder',
  standalone: true,
  imports: [CommonModule, RouterModule, RecipeModalComponent, DeleteModalComponent],
  templateUrl: './recipe-builder.component.html',
  styleUrls: ['./recipe-builder.component.scss'],
})
export class RecipeBuilderComponent implements OnInit {
  store  = inject(RecipesStore);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  recipe: RecipeEntity | null = null;

  ngOnInit(): void {
    this.recipe = this.store.selectedRecipe();
    if (!this.recipe) {
      // If navigated directly, load by id
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const found = this.store.recipes().find(r => r.id === id);
        if (found) { this.recipe = found; }
        else {
          this.store.loadAll();
          // wait for load then pick
          setTimeout(() => {
            this.recipe = this.store.recipes().find(r => r.id === id) ?? null;
          }, 600);
        }
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/planning/recipes']);
  }

  get totalCost(): number {
    if (!this.recipe) return 0;
    return this.recipe.ingredients.reduce(
      (sum, ri) => sum + ri.ingredient.unitPrice * ri.quantity,
      0
    );
  }

  get profitMargin(): number {
    if (!this.recipe || this.recipe.sellingPrice === 0) return 0;
    return ((this.recipe.sellingPrice - this.totalCost) / this.recipe.sellingPrice) * 100;
  }
}
