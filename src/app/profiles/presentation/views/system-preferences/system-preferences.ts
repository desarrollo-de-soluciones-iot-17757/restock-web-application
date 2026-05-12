import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../domain/model/profile.entity';
import { Business } from '../../../domain/model/business.entity';
import { ProfilesApi } from '../../../infrastructure/profiles-api';

@Component({
  selector: 'app-system-preferences',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './system-preferences.html',
  styleUrl: './system-preferences.css',
})
export class SystemPreferences implements OnInit {
  private readonly profilesApi = inject(ProfilesApi);

  activeTab = signal<'general' | 'profile' | 'branches'>('general');

  // ── General tab ──
  timezone = signal('UTC -05:00 Eastern Time (US & Canada)');
  currency = signal('USD - United States Dollar ($)');
  language = signal('English (US)');
  branch = signal('Main Branch');
  emailNotifications = signal(true);
  smsAlerts = signal(false);

  readonly timezones = [
    'UTC -12:00 International Date Line West',
    'UTC -08:00 Pacific Time (US & Canada)',
    'UTC -07:00 Mountain Time (US & Canada)',
    'UTC -06:00 Central Time (US & Canada)',
    'UTC -05:00 Eastern Time (US & Canada)',
    'UTC +00:00 Greenwich Mean Time',
    'UTC +01:00 Central European Time',
  ];

  readonly currencies = [
    'USD - United States Dollar ($)',
    'EUR - Euro (€)',
    'GBP - British Pound (£)',
    'JPY - Japanese Yen (¥)',
    'MXN - Mexican Peso ($)',
  ];

  readonly languages = ['English (US)', 'English (UK)', 'Spanish', 'French', 'Portuguese'];

  readonly branches = ['Main Branch', 'Branch North', 'Branch South', 'Branch East', 'Branch West'];

  // ── Profile tab ──
  profileEntityId = signal('');
  firstName = signal('');
  lastName = signal('');
  phone = signal('');
  avatarUrl = signal('');
  gender = signal('');
  birthDate = signal('');
  profileLoading = signal(false);

  // ── Businesses tab ──
  businesses = signal<Business[]>([]);
  businessLoading = signal(false);

  private savedProfile: Partial<Profile> = {};

  ngOnInit(): void {
    this.loadProfiles();
    this.loadBusinesses();
  }

  private loadProfiles(): void {
    this.profileLoading.set(true);
    this.profilesApi.getProfiles().subscribe({
      next: (profiles: Profile[]) => {
        if (profiles.length > 0) {
          this.applyProfile(profiles[0]);
          this.savedProfile = { ...profiles[0] };
        }
        this.profileLoading.set(false);
      },
      error: () => this.profileLoading.set(false),
    });
  }

  private loadBusinesses(): void {
    this.businessLoading.set(true);
    this.profilesApi.getBusinesses().subscribe({
      next: (businesses: Business[]) => {
        this.businesses.set(businesses);
        this.businessLoading.set(false);
      },
      error: () => this.businessLoading.set(false),
    });
  }

  private applyProfile(profile: Profile): void {
    this.profileEntityId.set(profile.id);
    this.firstName.set(profile.firstName);
    this.lastName.set(profile.lastName);
    this.phone.set(profile.phone);
    this.avatarUrl.set(profile.avatarUrl);
    this.gender.set(profile.gender);
    this.birthDate.set(profile.birthDate);
  }

  // ── Actions ──
  setTab(tab: 'general' | 'profile' | 'branches'): void {
    this.activeTab.set(tab);
  }

  discardChanges(): void {
    this.timezone.set('UTC -05:00 Eastern Time (US & Canada)');
    this.currency.set('USD - United States Dollar ($)');
    this.language.set('English (US)');
    this.branch.set('Main Branch');
    this.emailNotifications.set(true);
    this.smsAlerts.set(false);
  }

  savePreferences(): void {
    // persist preferences
  }

  discardProfileChanges(): void {
    if (this.savedProfile) {
      this.applyProfile(this.savedProfile as Profile);
    }
  }

  saveProfileChanges(): void {
    const profile: Profile = {
      id: this.profileEntityId(),
      userId: '',
      firstName: this.firstName(),
      lastName: this.lastName(),
      phone: this.phone(),
      avatarUrl: this.avatarUrl(),
      gender: this.gender(),
      birthDate: this.birthDate(),
    };
    this.profilesApi.updateProfile(profile, 0).subscribe({
      next: (updated: Profile) => {
        this.savedProfile = { ...updated };
      },
    });
  }
}
