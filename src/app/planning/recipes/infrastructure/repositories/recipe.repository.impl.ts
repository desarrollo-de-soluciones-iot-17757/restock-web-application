import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe } from '../../domain/model/recipe.model';
import { RecipeMetrics } from '../../domain/model/recipe-metrics.model';
import { RecipeHttpService } from '../services/recipe-http.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeRepositoryImpl implements RecipeRepository {

  constructor(
    private http: RecipeHttpService
  ) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.getRecipes();
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.getRecipeById(id);
  }

  getMetrics(): Observable<RecipeMetrics> {
    return this.http.getRecipes().pipe(
      map(recipes => ({
        totalRecipes: recipes.length,
        costFluctuation: -12.4,
        lowInventoryAlerts: recipes.filter(r => r.status === 'LOW STOCK').length
      }))
    );
  }

  create(recipe: Recipe): Observable<Recipe> {
    return this.http.create(recipe);
  }

  update(recipe: Recipe): Observable<Recipe> {
    return this.http.update(recipe);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(id);
  }
}