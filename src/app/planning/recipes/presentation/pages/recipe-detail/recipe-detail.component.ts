import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TopHeaderComponent } from '../../components/top-header/top-header.component';

import { Recipe } from '../../../domain/model/recipe.model';

import { GetRecipeByIdUseCase } from '../../../application/use-cases/get-recipe-by-id.usecase';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    TopHeaderComponent
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

  recipe!: Recipe;

  ingredients = [
    {
      name: 'Ground Beef',
      quantity: 2,
      unit: 'kg',
      price: 28
    },
    {
      name: 'Cheddar Cheese',
      quantity: 1,
      unit: 'pack',
      price: 12
    },
    {
      name: 'Burger Buns',
      quantity: 12,
      unit: 'units',
      price: 14
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private getRecipeByIdUseCase: GetRecipeByIdUseCase
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id')!;

    this.getRecipeByIdUseCase.execute(id)
      .subscribe(res => {
        this.recipe = res;
      });
  }

  get totalIngredientsCost(): number {
    return this.ingredients.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
  }
}