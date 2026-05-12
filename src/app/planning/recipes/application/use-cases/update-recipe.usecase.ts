import { Injectable } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateRecipeUseCase {

  constructor(private service: RecipeService) {}

  execute(recipe: any) {
    return this.service.update(recipe);
  }
}