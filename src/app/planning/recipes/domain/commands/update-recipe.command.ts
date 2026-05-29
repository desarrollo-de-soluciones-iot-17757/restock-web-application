import { RecipeIngredientCommand } from './create-recipe.command';
import { RecipeStatus } from '../model/recipe.entity';

export interface UpdateRecipeCommand {
  id: string;
  name?: string;
  description?: string;
  status?: RecipeStatus;
  imageUrl?: string;
  sku?: string;
  sellingPrice?: number;
  ingredients?: RecipeIngredientCommand[];
}
