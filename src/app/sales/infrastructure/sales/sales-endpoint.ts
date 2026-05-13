import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SaleAssembler } from './sale.assembler';
import { SaleResource, SalesResponse } from './sale.response';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Sale } from '../../domain/model/sale.entity';
import { map, Observable } from 'rxjs';


const salesApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSalesEndpointsPath}`;

/**
 * Sales API endpoint class responsible for handling HTTP requests and responses related to getting sales by branch id.
 * Extends the ErrorHandlingEnabledBaseType to include error handling functionality.
 */
export class SalesApiEndpoint extends BaseApiEndpoint<
  Sale,
  SaleResource,
  SalesResponse,
  SaleAssembler
> {
  /**
   * Constructor for SalesApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, salesApiEndpointUrl, new SaleAssembler());
  }

  /**
   * Retrieves sales by branch id from the API endpoint.
   * @param branchId - The id of the branch for which to retrieve sales.
   * @returns An Observable that emits an array of Sale entities.
   */
  getSalesByBranchId(branchId: string): Observable<Sale[]> {
    // json-server returns a plain array for the resource (e.g. [ {...} ])
    // but our assembler expects a SalesResponse with a `sales` array.
    // Normalize the response here to keep the assembler contract.
    return this.http
      .get<any>(this.endpointUrl, {
        params: {
          branchId,
        },
      })
      .pipe(
        map((response) => {
          // If the server returned an array, wrap it into the expected shape.
          const normalized: SalesResponse = Array.isArray(response)
            ? ({ sales: response } as SalesResponse)
            : response;
          return this.assembler.toEntitiesFromResponse(normalized);
        })
      );
  }
}
