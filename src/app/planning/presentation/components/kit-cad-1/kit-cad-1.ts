import { Component, Input, Output, EventEmitter, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kit } from '../../../domain/model/kit.entity';

@Component({
  selector: 'app-kit-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'kit-cad-1.html',
  styleUrl: 'kit-cad-1.css',
})
export class KitCardComponent {
  @Input({ required: true }) kit!: Kit;

  edit = output<Kit>();

  onEdit(): void {
    this.edit.emit(this.kit);
  }
}
