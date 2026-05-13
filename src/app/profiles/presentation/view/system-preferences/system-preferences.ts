import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Profile } from '../../../domain/model/profile.entity';
import { ProfilesStore } from '../../../application/profiles.store';
import { UpdateProfileCommand } from '../../../domain/model/update-profile.command';

/** Local snapshot for “discard changes” on the profile tab (primitives only). */
interface ProfileFieldSnapshot {
  profileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  gender: string;
  birthDate: string;
}

@Component({
  selector: 'app-system-preferences',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, TranslateModule],
  templateUrl: './system-preferences.html',
  styleUrl: './system-preferences.css',
})
export class SystemPreferences {
  private readonly store = inject(ProfilesStore);
  private readonly translate = inject(TranslateService);

  activeTab = signal<'general' | 'profile' | 'branches'>('general');

  // ── General tab ──
  timezone = signal('UTC -05:00 Eastern Time (US & Canada)');
  currency = signal('USD - United States Dollar ($)');
  language = signal(this.translate.getCurrentLang() || 'en');
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

  readonly languageOptions = [
    { code: 'en', label: 'English (US)' },
    { code: 'es', label: 'Spanish' },
  ];

  readonly branches = ['Main Branch', 'Branch North', 'Branch South', 'Branch East', 'Branch West'];

  // ── Profile tab (editable copies of the aggregate) ──
  profileEntityId = signal('');
  firstName = signal('');
  lastName = signal('');
  phone = signal('');
  avatarUrl = signal('');
  gender = signal('');
  birthDate = signal('');

  readonly profileLoading = computed(() => this.store.loading());
  readonly business = computed(() => this.store.business());
  readonly profileError = computed(() => this.store.error());

  private savedProfileFields: ProfileFieldSnapshot | null = null;

  constructor() {
    // Profile data is loaded from `Layout` for the shell; this view syncs when `profile()` updates.
    effect(() => {
      const profile = this.store.profile();
      if (!profile) {
        return;
      }
      this.applyProfile(profile);
      this.captureSnapshot(profile);
    });
  }

  /**
   * Copies aggregate getters into the template-bound signals.
   */
  private applyProfile(profile: Profile): void {
    this.profileEntityId.set(profile.id);
    this.firstName.set(profile.name);
    this.lastName.set(profile.lastName);
    this.phone.set(profile.phoneNumber.getValue());
    this.avatarUrl.set(profile.avatarUrl.getValue());
    this.gender.set(profile.gender);
    this.birthDate.set(profile.birthDate.getValue());
  }

  /**
   * Persists the last applied server state for discard support.
   */
  private captureSnapshot(profile: Profile): void {
    this.savedProfileFields = {
      profileId: profile.id,
      userId: profile.userId.getValue(),
      firstName: profile.name,
      lastName: profile.lastName,
      phone: profile.phoneNumber.getValue(),
      avatarUrl: profile.avatarUrl.getValue(),
      gender: profile.gender,
      birthDate: profile.birthDate.getValue(),
    };
  }

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
    this.translate.use(this.language());
  }

  setLanguage(languageCode: string): void {
    this.language.set(languageCode);
    this.translate.use(languageCode);
  }

  discardProfileChanges(): void {
    const snap = this.savedProfileFields;
    if (!snap) {
      return;
    }
    this.profileEntityId.set(snap.profileId);
    this.firstName.set(snap.firstName);
    this.lastName.set(snap.lastName);
    this.phone.set(snap.phone);
    this.avatarUrl.set(snap.avatarUrl);
    this.gender.set(snap.gender);
    this.birthDate.set(snap.birthDate);
  }

  /**
   * Sends an {@link UpdateProfileCommand} through the store (no direct API usage in the view).
   */
  saveProfileChanges(): void {
    const cmd = new UpdateProfileCommand({
      profileId: this.profileEntityId(),
      userId: this.store.profile()?.userId.getValue() ?? '',
      name: this.firstName(),
      lastName: this.lastName(),
      phoneNumber: this.phone(),
      avatarUrl: this.avatarUrl(),
      gender: this.gender(),
      birthDate: this.birthDate(),
    });
    this.store.updateProfile(cmd);
  }
}
