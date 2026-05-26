import { Routes } from '@angular/router';

export const RECIPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/views/recipes-list/recipes-list.component').then(
        m => m.RecipesListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./presentation/views/recipe-builder/recipe-builder.component').then(
        m => m.RecipeBuilderComponent
      ),
  },
];
