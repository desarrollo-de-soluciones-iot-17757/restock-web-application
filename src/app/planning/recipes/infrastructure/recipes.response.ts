import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * Resource representation of an ingredient for API communication.
 */
export interface IngredientResource extends BaseResource {
  /**
   * The unique identifier of the ingredient.
   */
  id: string;

  /**
   * The name of the ingredient.
   */
  name: string;

  /**
   * The monetary cost per single unit of the ingredient.
   */
  unit_price: number;

  /**
   * The standard unit of measurement for the ingredient.
   */
  unit_measure: string;
}

/**
 * Resource representation of a recipe-ingredient association.
 */
export interface RecipeIngredientResource {
  /**
   * The ingredient resource details.
   */
  ingredient: IngredientResource;

  /**
   * The required quantity of the ingredient for the recipe.
   */
  quantity: number;
}

/**
 * Resource representation of a recipe for API communication.
 */
export interface RecipeResource extends BaseResource {
  /**
   * The unique identifier of the recipe.
   */
  id: string;

  /**
   * The name of the recipe.
   */
  name: string;

  /**
   * The detailed description of the recipe.
   */
  description: string;

  /**
   * The current status of the recipe (e.g., ACTIVE, INACTIVE, LOW STOCK).
   */
  status: string;

  /**
   * The URL pointing to the recipe's representative image.
   */
  image_url: string;

  /**
   * The stock keeping unit (SKU) identifier for the recipe.
   */
  sku: string;

  /**
   * The designated selling price for the recipe.
   */
  selling_price: number;

  /**
   * The calculated estimated cost to produce the recipe.
   */
  estimated_cost: number;

  /**
   * The list of ingredients required to prepare the recipe.
   */
  ingredients: RecipeIngredientResource[];
}

/**
 * Response envelope for recipe collection queries.
 */
export interface RecipesResponse extends BaseResponse {
  /**
   * Array of recipe resources included in the response.
   * Contains zero or more recipe resources.
   */
  recipes: RecipeResource[];
}

/**
 * Response envelope for a single recipe query.
 */
export interface RecipeResponse extends BaseResponse {
  /**
   * The recipe resource included in the response.
   */
  recipe: RecipeResource;
}

/**
 * Response envelope for ingredient collection queries.
 */
export interface IngredientsResponse extends BaseResponse {
  /**
   * Array of ingredient resources included in the response.
   * Contains zero or more ingredient resources.
   */
  ingredients: IngredientResource[];
}