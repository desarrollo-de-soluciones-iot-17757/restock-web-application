import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Business } from '../../domain/model/business.entity';
import { BusinessResource, BusinessesListResponse } from './businesses.response';
import { BusinessesAssembler } from './businesses.assembler';
import { environment } from '../../../../environments/environment';
import { profilesApiOrigin } from '../profiles/profiles-api-origin';

/**
 * HTTP client for the `businesses` collection within the profiles bounded context.
 * Instantiated by {@link ProfilesApi}.
 */
export class BusinessesApiEndpoint extends BaseApiEndpoint<
  Business,
  BusinessResource,
  BusinessesListResponse,
  BusinessesAssembler
> {
  /**
   * @param http - Angular HTTP client.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderRegistrationBusinessDetailsEndpointPath}`,
      new BusinessesAssembler()
    );
  }
}

