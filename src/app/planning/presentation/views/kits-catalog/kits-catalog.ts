import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KitCardComponent } from '../../components/kit-card/kit-card';
import { KitsStore } from '../../../application/kits.store';
import { Kit } from '../../../domain/model/kit.entity';
import { KitFormModalComponent } from '../recipe-form/recipe-form';

@Component({
  selector: 'app-planning-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, KitCardComponent, KitFormModalComponent],
  templateUrl: './kits-catalog.html',
  styleUrl: './kits-catalog.css',
})
export class PlanningDashboardComponent implements OnInit {
  protected readonly kitsStore = inject(KitsStore);

  isCreateModalOpen = signal(false);

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
  }
}
