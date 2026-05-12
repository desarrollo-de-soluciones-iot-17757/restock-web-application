import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { RECIPES_MOCK } from '../mocks/recipe.mock';
import { Recipe } from '../../domain/model/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeHttpService {

  private recipes = [...RECIPES_MOCK];

  getRecipes(): Observable<Recipe[]> {
    return of(this.recipes).pipe(delay(300));
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipe = this.recipes.find(r => r.id === id)!;
    return of(recipe).pipe(delay(300));
  }

  create(recipe: Recipe): Observable<Recipe> {
    this.recipes.unshift(recipe);
    return of(recipe).pipe(delay(300));
  }

  update(recipe: Recipe): Observable<Recipe> {
    this.recipes = this.recipes.map(r =>
      r.id === recipe.id ? recipe : r
    );

    return of(recipe).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.recipes = this.recipes.filter(r => r.id !== id);
    return of(void 0).pipe(delay(300));
  }
}