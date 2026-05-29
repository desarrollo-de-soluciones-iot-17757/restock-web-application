import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';

import { RecipeEntity } from '../domain/model/recipe.entity';
import { IngredientEntity } from '../domain/model/ingredient.entity';
import { RecipeAssembler } from './recipes.assembler';
import {
  RecipesResponse,
  RecipeResource,
  IngredientsResponse
} from './recipes.response';

import { CreateRecipeCommand } from '../domain/commands/create-recipe.command';
import { UpdateRecipeCommand } from '../domain/commands/update-recipe.command';

/**
 * HTTP endpoint URL for Recipe Management API operations.
 */
const recipesApiEndpointUrl = '/api/v1/recipes'; // Ajusta la ruta base según tu backend

/**
 * HTTP endpoint URL for Ingredients API operations.
 */
const ingredientsApiEndpointUrl = '/api/v1/ingredients'; // Ajusta la ruta base según tu backend

/**
 * HTTP endpoint client for Recipe Management API operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for Recipe Management API operations.
 * It handles CRUD operations for recipes and retrieves available ingredients.
 */
@Injectable({ providedIn: 'root' })
export class RecipesApiEndpoint extends BaseApiEndpoint<RecipeEntity, RecipeResource, RecipesResponse, RecipeAssembler> {

  /**
   * Creates an instance of RecipesApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, recipesApiEndpointUrl, new RecipeAssembler());
  }

  /**
   * Retrieves a list of all available recipes.
   *
   * @returns Observable stream emitting the list of recipe domain entities.
   */
  override getAll(): Observable<RecipeEntity[]> {
    return this.http
      .get<RecipesResponse>(recipesApiEndpointUrl)
      .pipe(
        // Usamos el assembler para transformar el 'envelope' de la respuesta a un array de entidades
        map(response => this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError('Failed to retrieve recipes.'))
      );
  }

  /**
   * Retrieves a specific recipe by its unique identifier.
   *
   * @param id - The unique identifier of the recipe to retrieve.
   * @returns Observable stream emitting the found recipe domain entity.
   */
  override getById(id: string): Observable<RecipeEntity> {
    return this.http
      .get<RecipeResource>(`${recipesApiEndpointUrl}/${id}`)
      .pipe(
        // Mapeamos el recurso individual a entidad
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError(`Failed to retrieve recipe with id ${id}.`))
      );
  }

  /**
   * Creates a new recipe in the system using a command.
   *
   * @param cmd - The command containing the new recipe data and estimated cost.
   * @returns Observable stream emitting the successfully created recipe domain entity.
   */
  createRecipe(cmd: CreateRecipeCommand & { estimatedCost: number }): Observable<RecipeEntity> {
    return this.http
      .post<RecipeResource>(recipesApiEndpointUrl, cmd)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to create recipe.'))
      );
  }

  /**
   * Updates an existing recipe in the system using a command.
   *
   * @param cmd - The command containing the updated recipe data.
   * @returns Observable stream emitting the successfully updated recipe domain entity.
   */
  updateRecipe(cmd: UpdateRecipeCommand & { estimatedCost: number }): Observable<RecipeEntity> {
    return this.http
      .put<RecipeResource>(`${recipesApiEndpointUrl}/${cmd.id}`, cmd)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError(`Failed to update recipe with id ${cmd.id}.`))
      );
  }
  /**
   * Deletes a recipe by its unique identifier.
   *
   * @param id - The unique identifier of the recipe to delete.
   * @returns Observable stream emitting void upon successful deletion.
   */
  override delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${recipesApiEndpointUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`Failed to delete recipe with id ${id}.`))
      );
  }

  /**
   * Retrieves a list of all available ingredients.
   *
   * @returns Observable stream emitting the list of ingredient domain entities.
   */
  getAllIngredients(): Observable<IngredientEntity[]> {
    return this.http
      .get<IngredientsResponse>(ingredientsApiEndpointUrl)
      .pipe(
        // Extraemos el array de recursos y lo mapeamos usando el método del assembler
        map(response => this.assembler.ingredientListToEntities(response.ingredients)),
        catchError(this.handleError('Failed to retrieve ingredients.'))
      );
  }
}