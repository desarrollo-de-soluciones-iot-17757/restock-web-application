import { Injectable } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class GetRecipeByIdUseCase {

  constructor(private service: RecipeService) {}

  execute(id: string) {
    return this.service.getRecipeById(id);
  }
}