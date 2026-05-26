import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';

// Asumiendo que crearás estos archivos siguiendo el patrón de Devices:
import { RecipeEntity } from '../domain/model/recipe.entity';
import { RecipeAssembler } from './recipes.assembler';
import { RecipesResponse, RecipeResource, IngredientResource } from './recipes.response';

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
   * @returns Observable stream emitting the list of recipe resources.
   */
  getAll(): Observable<RecipeResource[]> {
    return this.http
      .get<RecipeResource[]>(recipesApiEndpointUrl)
      .pipe(
        catchError(this.handleError('Failed to retrieve recipes.'))
      );
  }

  /**
   * Retrieves a specific recipe by its unique identifier.
   *
   * @param id - The unique identifier of the recipe to retrieve.
   * @returns Observable stream emitting the found recipe resource.
   */
  getById(id: string): Observable<RecipeResource> {
    return this.http
      .get<RecipeResource>(`${recipesApiEndpointUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`Failed to retrieve recipe with id ${id}.`))
      );
  }

  /**
   * Creates a new recipe in the system.
   *
   * @param cmd - The command containing the new recipe data and estimated cost.
   * @returns Observable stream emitting the successfully created recipe resource.
   */
  create(cmd: CreateRecipeCommand & { estimatedCost: number }): Observable<RecipeResource> {
    return this.http
      .post<RecipeResource>(recipesApiEndpointUrl, cmd)
      .pipe(
        catchError(this.handleError('Failed to create recipe.'))
      );
  }

  /**
   * Updates an existing recipe in the system.
   *
   * @param cmd - The command containing the updated recipe data.
   * @returns Observable stream emitting the successfully updated recipe resource.
   */
  update(cmd: UpdateRecipeCommand & { estimatedCost: number }): Observable<RecipeResource> {
    return this.http
      .put<RecipeResource>(`${recipesApiEndpointUrl}/${cmd.id}`, cmd)
      .pipe(
        catchError(this.handleError(`Failed to update recipe with id ${cmd.id}.`))
      );
  }

  /**
   * Deletes a recipe by its unique identifier.
   *
   * @param id - The unique identifier of the recipe to delete.
   * @returns Observable stream emitting void upon successful deletion.
   */
  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${recipesApiEndpointUrl}/${id}`)
      .pipe(
        catchError(this.handleError(`Failed to delete recipe with id ${id}.`))
      );
  }

  /**
   * Retrieves a list of all available ingredients.
   *
   * @returns Observable stream emitting the list of ingredient resources.
   */
  getAllIngredients(): Observable<IngredientResource[]> {
    return this.http
      .get<IngredientResource[]>(ingredientsApiEndpointUrl)
      .pipe(
        catchError(this.handleError('Failed to retrieve ingredients.'))
      );
  }
}