import { Injectable } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteRecipeUseCase {

  constructor(private service: RecipeService) {}

  execute(id: string) {
    return this.service.delete(id);
  }
}