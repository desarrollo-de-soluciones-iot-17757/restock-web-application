import { Routes } from '@angular/router';

const recipesList = () =>
  import('./views/recipes-list/recipes-list.component').then(
    (m) => m.RecipesListComponent,
  );

const recipeBuilder = () =>
  import('./views/recipe-builder/recipe-builder.component').then(
    (m) => m.RecipeBuilderComponent,
  );

/**
 * Routes for the recipes module.
 */
export const recipesRoutes: Routes = [
  {
    path: '',
    loadComponent: recipesList,
    title: 'Recipes List', // Opcional: puedes ajustar el título según necesites
  },
  {
    path: ':id',
    loadComponent: recipeBuilder,
    title: 'Recipe Builder', // Opcional: puedes ajustar el título según necesites
  },
];