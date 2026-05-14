import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource, ProfilesListResponse } from './profiles.response';
import { ProfilesAssembler } from './profiles.assembler';
import { profilesApiOrigin } from './profiles-api-origin';

/**
 * HTTP client for the `profiles` collection (mirrors `sales-endpoint` in the sales context).
 * Instantiated by {@link ProfilesApi}.
 */
export class ProfilesApiEndpoint extends BaseApiEndpoint<
  Profile,
  ProfileResource,
  ProfilesListResponse,
  ProfilesAssembler
> {
  /**
   * @param http - Angular HTTP client.
   */
  constructor(http: HttpClient) {
    super(http, `${profilesApiOrigin()}/profiles`, new ProfilesAssembler());
  }
}
