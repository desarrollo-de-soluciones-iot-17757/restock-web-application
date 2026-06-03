import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSupply } from '../../../domain/model/custom-supply.entity';

@Component({
  selector: 'app-custom-supply-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-supply-card.html',
  styleUrl: './custom-supply-card.css'
})
export class CustomSupplyCardComponent {
  @Input({ required: true }) customSupply!: CustomSupply;
  @Output() onEdit = new EventEmitter<CustomSupply>();
  @Output() onView = new EventEmitter<string>();

  edit(): void {
    this.onEdit.emit(this.customSupply);
  }

  view(): void {
    this.onView.emit(this.customSupply.id);
  }
}
