import { Injectable } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class GetRecipeMetricsUseCase {

  constructor(private service: RecipeService) {}

  execute() {
    return this.service.getMetrics();
  }
}