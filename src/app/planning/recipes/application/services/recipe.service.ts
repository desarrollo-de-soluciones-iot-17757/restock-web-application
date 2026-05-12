import { Injectable } from '@angular/core';
import { RecipeRepositoryImpl } from '../../infrastructure/repositories/recipe.repository.impl';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    private repository: RecipeRepositoryImpl
  ) {}

  getRecipes() {
    return this.repository.getRecipes();
  }

  getRecipeById(id: string) {
    return this.repository.getRecipeById(id);
  }

  getMetrics() {
    return this.repository.getMetrics();
  }

  create(recipe: any) {
    return this.repository.create(recipe);
  }

  update(recipe: any) {
    return this.repository.update(recipe);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}