import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResourceStore } from '../../../application/resource.store';
import { IamStore as AuthService } from '../../../../iam/application/iam.store';
import { CustomSupply } from '../../../domain/model/custom-supply.entity';
import { CustomSupplyCardComponent } from '../../components/custom-supply-card/custom-supply-card';
import { CreateCustomSupplyDialogComponent } from '../../components/create-custom-supply-dialog/create-custom-supply-dialog';
import { RESOURCE_PATHS } from '../../../infrastructure/resource-paths.registry';

@Component({
  selector: 'app-custom-supplies-section',
  standalone: true,
  imports: [CommonModule, RouterModule, CustomSupplyCardComponent, CreateCustomSupplyDialogComponent],
  templateUrl: './custom-supplies-section.html',
  styleUrl: './custom-supplies-section.css'
})
export class CustomSuppliesSectionComponent implements OnInit {
  private readonly store = inject(ResourceStore);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly customSupplies = this.store.customSupplies;
  readonly RESOURCE_PATHS = RESOURCE_PATHS;

  showCreateModal = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const accountId = (user as any)?.accountId ?? 'acc-123';
    this.store.loadCustomSuppliesByAccount(accountId);
  }

  onViewSupply(id: string): void {
    this.router.navigate([RESOURCE_PATHS.customSupplies.detail(id)]);
  }

  onEditSupply(supply: CustomSupply): void {
    this.router.navigate([RESOURCE_PATHS.customSupplies.detail(supply.id)]);
  }
}
