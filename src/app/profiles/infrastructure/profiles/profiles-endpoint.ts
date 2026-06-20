import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource, ProfilesListResponse } from './profiles.response';
import { ProfilesAssembler } from './profiles.assembler';
import { profilesApiOrigin, profilesApiFallbackOrigin } from './profiles-api-origin';

export class ProfilesApiEndpoint extends BaseApiEndpoint<
  Profile,
  ProfileResource,
  ProfilesListResponse,
  ProfilesAssembler
> {
  private readonly primaryUrl: string;
  private readonly fallbackUrl: string;

  constructor(http: HttpClient) {
    const primary = `${profilesApiOrigin()}/profiles`;
    super(http, primary, new ProfilesAssembler());
    this.primaryUrl = primary;
    this.fallbackUrl = `${profilesApiFallbackOrigin()}/profiles`;
  }

  override getAll(): Observable<Profile[]> {
    return super.getAll().pipe(catchError(() => this.withFallback(() => super.getAll())));
  }

  getAllByAccountId(accountId: string): Observable<Profile[]> {
    const url = `${this.endpointUrl}?accountId=${encodeURIComponent(accountId)}`;
    const operation = () =>
      this.http.get<ProfilesListResponse>(url).pipe(
        map((res) => this.assembler.toEntitiesFromResponse(res)),
      );
    return operation().pipe(catchError(() => {
      const fallbackUrl = `${this.fallbackUrl}?accountId=${encodeURIComponent(accountId)}`;
      return this.http.get<ProfilesListResponse>(fallbackUrl).pipe(
        map((res) => this.assembler.toEntitiesFromResponse(res)),
      );
    }));
  }

  override getById(id: string): Observable<Profile> {
    return super.getById(id).pipe(catchError(() => this.withFallback(() => super.getById(id))));
  }

  override create(entity: Profile): Observable<Profile> {
    return this.createWithImage(entity);
  }

  override update(entity: Profile, id: string): Observable<Profile> {
    return this.updateWithImage(entity, id);
  }

  createWithImage(entity: Profile, imageFile?: File): Observable<Profile> {
    const fd = buildProfileFormData(this.assembler.toResourceFromEntity(entity), imageFile);
    const operation = () =>
      this.http.post<ProfileResource>(this.endpointUrl, fd).pipe(
        map((created) => this.assembler.toEntityFromResource(created)),
      );
    return operation().pipe(
      catchError(() => this.withFallback(operation)),
      catchError(this.handleError('Failed to create profile')),
    );
  }

  updateWithImage(entity: Profile, id: string, imageFile?: File): Observable<Profile> {
    const fd = buildProfileFormData(this.assembler.toResourceFromEntity(entity), imageFile);
    const operation = () =>
      this.http.patch<ProfileResource>(`${this.endpointUrl}/${encodeURIComponent(id)}`, fd).pipe(
        map((updated) => this.assembler.toEntityFromResource(updated)),
      );
    return operation().pipe(
      catchError(() => this.withFallback(operation)),
      catchError(this.handleError('Failed to update profile')),
    );
  }

  private withFallback<T>(operation: () => Observable<T>): Observable<T> {
    this.endpointUrl = this.fallbackUrl;
    const result$ = operation();
    this.endpointUrl = this.primaryUrl;
    return result$;
  }
}

function buildProfileFormData(resource: ProfileResource, imageFile?: File): FormData {
  const fd = new FormData();
  if (resource.accountId)   fd.append('accountId', resource.accountId);
  if (resource.userId)      fd.append('userId', resource.userId);
  if (resource.name)        fd.append('name', resource.name);
  if (resource.lastName)    fd.append('lastName', resource.lastName);
  if (resource.phoneNumber) fd.append('phoneNumber', resource.phoneNumber);
  if (resource.gender)      fd.append('gender', resource.gender);
  if (resource.birthDate)   fd.append('birthDate', resource.birthDate);
  if (imageFile)            fd.append('image', imageFile);
  return fd;
}
