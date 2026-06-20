import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  /**
   * Backend:
   * GET /api/v1/profiles?accountId={accountId}
   *
   * Response: ProfileResource[] (bare array)
   * Throws HttpErrorResponse(404) when no profile exists for the given account.
   */
  getByAccountId(accountId: string): Observable<Profile> {
    const encodedAccountId = encodeURIComponent(accountId);
    const primaryUrl = `${this.primaryUrl}?accountId=${encodedAccountId}`;
    const fallbackUrl = `${this.fallbackUrl}?accountId=${encodedAccountId}`;

    const parseLast = (response: unknown): Profile => {
      const list: ProfileResource[] = Array.isArray(response)
        ? response
        : (response as any)?.profiles ?? [];
      const resource = list[list.length - 1];
      if (!resource) throw new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      return this.assembler.toEntityFromResource(resource);
    };

    return this.http.get<unknown>(primaryUrl).pipe(
      map(parseLast),
      catchError(() =>
        this.http.get<unknown>(fallbackUrl).pipe(map(parseLast)),
      ),
    ) as Observable<Profile>;
  }

  override getById(id: string): Observable<Profile> {
    return super.getById(id).pipe(
      catchError(() => this.withFallback(() => super.getById(id))),
      catchError(this.handleError('Failed to get profile by ID')),
    );
  }

  override create(entity: Profile): Observable<Profile> {
    return this.createWithImage(entity);
  }

  override update(entity: Profile, id: string): Observable<Profile> {
    return this.updateWithImage(entity, id);
  }

  createWithImage(entity: Profile, imageFile?: File): Observable<Profile> {
    const fd = buildProfileFormData(
      this.assembler.toResourceFromEntity(entity),
      imageFile
    );

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
    const fd = buildProfileFormData(
      this.assembler.toResourceFromEntity(entity),
      imageFile
    );

    const operation = () =>
      this.http.patch<ProfileResource>(
        `${this.endpointUrl}/${encodeURIComponent(id)}`,
        fd
      ).pipe(
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

  if (resource.accountId) fd.append('accountId', resource.accountId);
  if (resource.userId) fd.append('userId', resource.userId);
  if (resource.name) fd.append('name', resource.name);
  if (resource.lastName) fd.append('lastName', resource.lastName);
  if (resource.phoneNumber) fd.append('phoneNumber', resource.phoneNumber);
  if (resource.gender) fd.append('gender', resource.gender);
  if (resource.birthDate) fd.append('birthDate', resource.birthDate);
  if (imageFile) fd.append('image', imageFile);

  return fd;
}