import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { TopHeaderComponent } from '../../components/top-header/top-header.component';
import { RecipeFormModalComponent } from '../../components/recipe-form-modal/recipe-form-modal.component';

import { Recipe } from '../../../domain/model/recipe.model';

import { GetRecipesUseCase } from '../../../application/use-cases/get-recipes.usecase';
import { GetRecipeMetricsUseCase } from '../../../application/use-cases/get-recipe-metrics.usecase';

@Component({
  selector: 'app-recipe-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RecipeCardComponent,
    RecipeFormModalComponent,
    TopHeaderComponent
  ],
  templateUrl: './recipe-catalog.component.html',
  styleUrls: ['./recipe-catalog.component.scss']
})
export class RecipeCatalogComponent implements OnInit {

  recipes: Recipe[] = [];
  showCreateModal = false;
  metrics: any;

  constructor(
    private getRecipesUseCase: GetRecipesUseCase,
    private getMetricsUseCase: GetRecipeMetricsUseCase
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.getRecipesUseCase.execute()
      .subscribe(res => this.recipes = res);

    this.getMetricsUseCase.execute()
      .subscribe(res => this.metrics = res);
  }
}