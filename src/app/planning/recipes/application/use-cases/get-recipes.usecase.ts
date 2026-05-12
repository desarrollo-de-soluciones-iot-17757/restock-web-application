import { Injectable } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class GetRecipesUseCase {

  constructor(private service: RecipeService) {}

  execute() {
    return this.service.getRecipes();
  }
}