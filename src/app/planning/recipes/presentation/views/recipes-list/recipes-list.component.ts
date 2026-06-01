import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipesStore } from '../../../application/recipes.store';
import { RecipeEntity } from '../../../domain/model/recipe.entity';
import { RecipeModalComponent } from '../../components/modals/recipe-modal/recipe-modal.component';
import { DeleteModalComponent } from '../../components/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeModalComponent, DeleteModalComponent],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent implements OnInit {
  store = inject(RecipesStore);
  private router = inject(Router);

  ngOnInit(): void {
    this.store.loadAll();
    this.store.loadIngredients();
  }

  goToDetail(recipe: RecipeEntity): void {
    this.store.selectRecipe(recipe);
    this.router.navigate(['/planning/recipes', recipe.id]);
  }

  getStatusLabel(status: string): string {
    return status;
  }

  onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }

  openMenu(event: Event, recipe: RecipeEntity): void {
    event.stopPropagation();
    // context menu handled inline in template
  }
}
