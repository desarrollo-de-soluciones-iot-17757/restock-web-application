import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KitsStore } from '../../../application/kits.store';
import { Kit } from '../../../domain/model/kit.entity';
import { KitFormModalComponent } from '../recipe-form/recipe-form';
import { KitCardComponent } from '../../components/kit-cad-1/kit-cad-1';
import { EditKitModalComponent } from '../edit-kit/edit-kit';

@Component({
  selector: 'app-planning-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KitCardComponent,
    KitFormModalComponent,
    EditKitModalComponent,
  ],
  templateUrl: './kits-catalog.html',
  styleUrl: './kits-catalog.css',
})
export class PlanningDashboardComponent implements OnInit {
  protected readonly kitsStore = inject(KitsStore);

  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  selectedKit = signal<Kit | null>(null);

  ngOnInit(): void {
    console.log('Iniciando carga de kits...');
    this.kitsStore.loadAllKits();
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }
  handleEditKit(kit: Kit): void {
    console.log('Kit seleccionado para actualización estratégica:', kit);
    this.selectedKit.set(kit);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedKit.set(null);
  }
}
