import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { KitsAssembler } from './kits.assembler';
import { KitResource, KitsResponse } from './kits.response';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Kit } from '../../domain/model/kit.entity';
import { map, Observable } from 'rxjs';

/**
 * Kits API endpoint class responsible for handling HTTP requests related to Kits.
 */
export class KitsApiEndpoint extends BaseApiEndpoint<
  Kit,
  KitResource,
  KitsResponse,
  KitsAssembler
> {
  /**
   * Constructor for KitsApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}/kits`, new KitsAssembler());
  }

  /**
   * Retrieves all kits from the API.
   * @returns An Observable that emits an array of Kit entities.
   */
  getAllKits(): Observable<Kit[]> {
    return this.http
      .get<KitsResponse>(this.endpointUrl)
      .pipe(map((response) => this.assembler.toEntitiesFromResponse(response)));
  }
}
