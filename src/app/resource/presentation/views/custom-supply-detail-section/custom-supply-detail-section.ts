import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResourceStore } from '../../../application/resource.store';
import { EditCustomSupplyDialogComponent } from '../../components/edit-custom-supply-dialog/edit-custom-supply-dialog';

@Component({
  selector: 'app-custom-supply-detail-section',
  standalone: true,
  imports: [CommonModule, EditCustomSupplyDialogComponent],
  templateUrl: './custom-supply-detail-section.html',
  styleUrl: './custom-supply-detail-section.css'
})
export class CustomSupplyDetailSectionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ResourceStore);
  private readonly router = inject(Router);

  params = toSignal(this.route.paramMap);
  customSupply = computed(() =>
    this.store.getCustomSupplyById(this.params()?.get('id') ?? '')
  );

  showEditModal = false;

  onCloseModal(): void {
    this.showEditModal = false;
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
