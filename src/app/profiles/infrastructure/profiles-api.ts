import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Profile } from '../domain/model/profile.entity';
import { Business } from '../domain/model/business.entity';
import { ProfilesApiEndpoint } from './profiles/profiles-endpoint';
import { BusinessesApiEndpoint } from './businesses/businesses-endpoint';


@Injectable({ providedIn: 'root' })
export class ProfilesApi extends BaseApi {
  private readonly profilesEndpoint: ProfilesApiEndpoint;
  private readonly businessesEndpoint: BusinessesApiEndpoint;

  /**
   * @param http - Shared `HttpClient` from the Angular root injector.
   */
  constructor(http: HttpClient) {
    super();
    this.profilesEndpoint = new ProfilesApiEndpoint(http);
    this.businessesEndpoint = new BusinessesApiEndpoint(http);
  }

  /**
   * @param accountId - Filters profiles to the given account scope.
   */
  getProfiles(accountId: string): Observable<Profile[]> {
    return this.profilesEndpoint.getAllByAccountId(accountId);
  }

  /**
   * @param id - Profile document id (string, e.g. Mongo ObjectId).
   */
  getProfile(id: string): Observable<Profile> {
    return this.profilesEndpoint.getById(id);
  }

  createProfile(profile: Profile, imageFile?: File): Observable<Profile> {
    return this.profilesEndpoint.createWithImage(profile, imageFile);
  }

  updateProfile(profile: Profile, id: string, imageFile?: File): Observable<Profile> {
    return this.profilesEndpoint.updateWithImage(profile, id, imageFile);
  }

  createBusiness(business: Business, imageFile?: File): Observable<Business> {
    return this.businessesEndpoint.createWithImage(business, imageFile);
  }

  updateBusiness(business: Business, id: string, imageFile?: File): Observable<Business> {
    return this.businessesEndpoint.updateWithImage(business, id, imageFile);
  }

  /**
   * @returns Observable of all businesses for the authenticated scope.
   */
  getBusinesses(): Observable<Business[]> {
    return this.businessesEndpoint.getAll();
  }

  /**
   * @param id - Business document id (string).
   */
  getBusiness(id: string): Observable<Business> {
    return this.businessesEndpoint.getById(id);
  }
}
