import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../domain/model/profile.entity';
import { Business } from '../../domain/model/business.entity';

export interface ProfilesRepository {
  getProfiles(): Observable<Profile[]>;
  getProfile(id: number | string): Observable<Profile>;
  updateProfile(profile: Profile, id: number | string): Observable<Profile>;
  getBusinesses(): Observable<Business[]>;
  getBusiness(id: number | string): Observable<Business>;
}

export const PROFILES_REPOSITORY = new InjectionToken<ProfilesRepository>(
  'ProfilesRepository'
);
