import { Routes } from '@angular/router';
import { RecipeCatalogComponent } from './planning/recipes/presentation/pages/recipe-catalog/recipe-catalog.component';
import { RecipeDetailComponent } from './planning/recipes/presentation/pages/recipe-detail/recipe-detail.component';

const baseTitle = 'RestockWebApplication';

/**
 * Root route configuration that composes bounded-context routes.
 */
export const appRoutes: Routes = [

  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  },

  {
    path: 'recipes',
    component: RecipeCatalogComponent,
    title: `${baseTitle} | Recipes`
  },
  {
    path: 'recipes/:id',
    component: RecipeDetailComponent,
    title: `${baseTitle} | Recipe Detail`
  }

];