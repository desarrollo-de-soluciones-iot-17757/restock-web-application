import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateRecipeUseCase } from '../../../application/use-cases/create-recipe.usecase';

@Component({
    selector: 'app-recipe-form-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './recipe-form-modal.component.html',
    styleUrls: ['./recipe-form-modal.component.scss']
})
export class RecipeFormModalComponent {

    constructor(
        private createRecipeUseCase: CreateRecipeUseCase
    ) { }

    @Output() close = new EventEmitter<void>();
    @Output() recipeCreated = new EventEmitter<void>();
    recipeName = '';

    estimatedCost = 0;

    saveRecipe() {

        const recipe = {
            id: crypto.randomUUID(),

            name: this.recipeName,

            description: 'New custom recipe',

            status: 'ACTIVE',

            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',

            sku: 'NEW-001',

            sellingPrice: this.estimatedCost * 2,

            estimatedCost: this.estimatedCost
        };

        this.createRecipeUseCase.execute(recipe)
        .subscribe(() => {

            this.recipeCreated.emit();
          
            this.closeModal();
          });
    }

    closeModal() {
        this.close.emit();
    }
}