import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../domain/model/recipe.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
    constructor(
        private router: Router
      ) {}
    
  @Input() recipe!: Recipe;

  @Output() edit = new EventEmitter<void>();

  goToDetail() {
    this.router.navigate(['/recipes', this.recipe.id]);
  }
}