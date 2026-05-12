import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssignedBranch, Profile } from '../../../domain/model/profile.entity';
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
  profileId = signal<number>(1);
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  photoUrl = signal('');
  assignedBranches = signal<AssignedBranch[]>([]);
  profileLoading = signal(false);

  private savedProfile: Partial<Profile> = {};

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.profileLoading.set(true);
    this.profilesApi.getProfile(this.profileId()).subscribe({
      next: (profile: Profile) => {
        this.applyProfile(profile);
        this.savedProfile = { ...profile };
        this.profileLoading.set(false);
      },
      error: (_err: unknown) => {
        this.profileLoading.set(false);
      },
    });
  }

  private applyProfile(profile: Profile): void {
    this.firstName.set(profile.firstName);
    this.lastName.set(profile.lastName);
    this.email.set(profile.email);
    this.phone.set(profile.phone);
    this.photoUrl.set(profile.photoUrl);
    this.assignedBranches.set(profile.assignedBranches);
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
      id: String(this.profileId()),
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phone: this.phone(),
      photoUrl: this.photoUrl(),
      assignedBranches: this.assignedBranches(),
    };
    this.profilesApi.updateProfile(profile, this.profileId()).subscribe({
      next: (updated: Profile) => {
        this.savedProfile = { ...updated };
      },
    });
  }
}
