import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Kit } from '../../../domain/model/kit.entity';

/**
 * KitCardComponent
 * Displays a summary of a kit including image, name, price, and status.
 */
@Component({
  selector: 'app-kit-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kit-card.html',
  styleUrls: ['./kit-card.css'],
})
export class KitCardComponent {
  /**
   * The Kit entity to display.
   */
  @Input({ required: true }) kit!: Kit;

  constructor(private router: Router) {}

  /**
   * Navigates to the detailed view of the kit.
   */
  onViewDetail(): void {
    this.router.navigate(['/catalog/kits', this.kit.id]);
  }
}
