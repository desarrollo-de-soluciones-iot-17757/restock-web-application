import { Observable } from 'rxjs';
import { Recipe } from '../model/recipe.model';
import { RecipeMetrics } from '../model/recipe-metrics.model';

export abstract class RecipeRepository {
  abstract getRecipes(): Observable<Recipe[]>;
  abstract getRecipeById(id: string): Observable<Recipe>;
  abstract getMetrics(): Observable<RecipeMetrics>;

  abstract create(recipe: Recipe): Observable<Recipe>;
  abstract update(recipe: Recipe): Observable<Recipe>;
  abstract delete(id: string): Observable<void>;
}