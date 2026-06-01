import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { RecipeEntity, RecipeIngredient } from '../domain/model/recipe.entity';
import { IngredientEntity } from '../domain/model/ingredient.entity';
import {
  RecipeResource,
  RecipesResponse,
  IngredientResource,
  RecipeIngredientResource,
} from './recipes.response';

/**
 * Assembler for converting between Recipe entities and infrastructure resources.
 *
 * @remarks
 * This assembler is responsible for transforming between:
 * - {@link RecipeEntity} - Domain entity for managing recipe state.
 * - {@link RecipeResource} - Infrastructure resource for API communication.
 * - {@link RecipesResponse} - API response from recipe list endpoint.
 */
export class RecipeAssembler implements BaseAssembler<RecipeEntity, RecipeResource, RecipesResponse> {

  /**
   * Maps the response envelope to a list of domain entities.
   *
   * @param response - The response envelope containing recipe resources.
   * @returns A list of domain entities representing the recipes.
   */
  toEntitiesFromResponse(response: RecipesResponse): RecipeEntity[] {
    console.log(response);
    // Nota: Se asume que tu interface RecipesResponse tiene una propiedad 'recipes'
    // equivalente a la propiedad 'devices' de tu ejemplo base.
    return response.recipes.map(resource => this.toEntityFromResource(resource as RecipeResource));
  }

  /**
   * Maps a single recipe resource to a domain entity.
   *
   * @param resource - The recipe resource to map.
   * @returns A domain entity representing the recipe.
   */
  toEntityFromResource(resource: RecipeResource): RecipeEntity {
    return new RecipeEntity({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      status: resource.status as RecipeEntity['status'],
      imageUrl: resource.image_url,
      sku: resource.sku,
      sellingPrice: resource.selling_price,
      estimatedCost: resource.estimated_cost,
      ingredients: (resource.ingredients ?? []).map(ri => this.toIngredientPair(ri)),
    });
  }

  /**
   * Maps a domain entity to a recipe resource.
   *
   * @param entity - The domain entity to map.
   * @returns A recipe resource representing the domain entity.
   */
  toResourceFromEntity(entity: RecipeEntity): RecipeResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      image_url: entity.imageUrl,
      sku: entity.sku,
      selling_price: entity.sellingPrice,
      estimated_cost: entity.estimatedCost,
      ingredients: entity.ingredients.map(ri => ({
        ingredient: this.ingredientToResource(ri.ingredient),
        quantity: ri.quantity,
      })),
    } as RecipeResource;
  }

  /**
   * Helper method to map a recipe ingredient resource to its domain pair.
   *
   * @param ri - The recipe ingredient resource.
   * @returns A domain representation of the recipe ingredient.
   */
  private toIngredientPair(ri: RecipeIngredientResource): RecipeIngredient {
    return {
      ingredient: new IngredientEntity({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        unitPrice: ri.ingredient.unit_price,
        unitMeasure: ri.ingredient.unit_measure,
      }),
      quantity: ri.quantity,
    };
  }

  /**
   * Helper method to map an ingredient entity to its resource representation.
   *
   * @param entity - The ingredient domain entity.
   * @returns An ingredient resource.
   */
  private ingredientToResource(entity: IngredientEntity): IngredientResource {
    return {
      id: entity.id,
      name: entity.name,
      unit_price: entity.unitPrice,
      unit_measure: entity.unitMeasure,
    };
  }

  /**
   * Maps a single ingredient resource to a domain entity.
   *
   * @param resource - The ingredient resource to map.
   * @returns A domain entity representing the ingredient.
   */
  ingredientToEntity(resource: IngredientResource): IngredientEntity {
    return new IngredientEntity({
      id: resource.id,
      name: resource.name,
      unitPrice: resource.unit_price,
      unitMeasure: resource.unit_measure,
    });
  }

  /**
   * Maps a list of ingredient resources to domain entities.
   *
   * @param resources - The list of ingredient resources.
   * @returns A list of domain entities representing the ingredients.
   */
  ingredientListToEntities(resources: IngredientResource[]): IngredientEntity[] {
    return resources.map(r => this.ingredientToEntity(r));
  }
}