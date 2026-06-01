import { RecipeStatus } from '../model/recipe.entity';

export interface RecipeIngredientCommand {
  ingredientId: string;
  quantity: number;
}

export interface CreateRecipeCommand {
  name: string;
  description: string;
  status: RecipeStatus;
  imageUrl: string;
  sku: string;
  sellingPrice: number;
  ingredients: RecipeIngredientCommand[];
}
