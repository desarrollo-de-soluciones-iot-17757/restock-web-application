import { Component, EventEmitter, Output, signal, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ProfilesApi } from '../../../infrastructure/profiles-api';
import { IamStore } from '../../../../iam/application/iam.store';
import { Business } from '../../../domain/model/business.entity';

@Component({
  selector: 'app-registration-business-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './registration-business-details.html',
  styleUrl: './registration-business-details.css',
})
export class RegistrationBusinessDetails {
  @Output() createAccount = new EventEmitter<object>();

  private readonly router = inject(Router);
  private readonly profilesApi = inject(ProfilesApi);
  private readonly iamStore = inject(IamStore);

  readonly countries = [
    'United States', 'Canada', 'Mexico', 'Argentina', 'Brazil',
    'Colombia', 'Chile', 'Peru', 'Spain', 'United Kingdom',
  ];

  readonly allCategories = [
    'Pharmaceuticals', 'IoT Sensors', 'Cold Storage', 'Electronics',
    'Food & Beverage', 'Automotive', 'Medical Devices', 'Retail',
    'Manufacturing', 'Logistics',
  ];

  readonly selectedCategories = signal<string[]>([
    'Pharmaceuticals', 'IoT Sensors', 'Cold Storage',
  ]);

  readonly availableToAdd = computed(() =>
    this.allCategories.filter((c) => !this.selectedCategories().includes(c))
  );

  readonly form = new FormGroup({
    businessName: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl('United States'),
    description: new FormControl(''),
  });

  addCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.selectedCategories.update((cats) => [...cats, value]);
      (event.target as HTMLSelectElement).value = '';
    }
  }

  removeCategory(category: string): void {
    this.selectedCategories.update((cats) => cats.filter((c) => c !== category));
  }

  onBack(): void {
    this.router.navigate(['/profiles/register']);
  }

  onCreateAccount(): void {
    const businessPayload = {
      ...this.form.value,
      categories: this.selectedCategories(),
    };
    this.createAccount.emit(businessPayload);
    this.iamStore.completeSignUp({
      businessName: this.form.value.businessName ?? undefined,
      phone: this.form.value.phoneNumber ?? undefined,
      country: this.form.value.country ?? undefined,
      categories: this.selectedCategories(),
    });
  }

  private storeBusiness() {
    const formValue = this.form.value;
    const business = new Business({
      businessId: `business_${Date.now()}`,
      companyName: formValue.businessName ?? '',
      ruc: '0000000000',
      pictureUrl: 'https://placehold.co/150',
      mainLocation: `${formValue.address ?? ''}, ${formValue.city ?? ''}, ${formValue.country ?? ''}`,
      ownerId: 'user_1',
    });

    return this.profilesApi.createBusiness(business);
  }
}
