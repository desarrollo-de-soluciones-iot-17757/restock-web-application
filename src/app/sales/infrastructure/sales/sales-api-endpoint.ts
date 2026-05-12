
import { ErrorHandlingEnabledBaseType } from '../../../shared/infrastructure/error-handling-enabled-base-type';
import { RegisterSaleAssembler } from './register-sale.assembler';
import { RegisterSaleCommand } from '../../domain/model/register-sale.command';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { RegisterSaleResource, RegisterSaleResponse } from './register-sale.response';


/**
 * Sales API endpoint class responsible for handling HTTP requests and responses related to sales operations.
 * Extends the ErrorHandlingEnabledBaseType to include error handling functionality.
 */
export class RegisterSaleEndpoint extends ErrorHandlingEnabledBaseType {

  /**
   * Constructor for SalesApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   * @param assembler - The RegisterSaleAssembler instance for converting between domain models and API resources.
   */
  constructor(
    private http: HttpClient,
    private assembler: RegisterSaleAssembler,
  ) {
    super();
  }

  /**
   * Registers a new sale using the provided RegisterSaleCommand.
   * @param registerSaleCommand - The RegisterSaleCommand containing the sale details.
   * @returns An Observable that emits the RegisterSaleResource upon successful registration.
   */
  registerSale(registerSaleCommand: RegisterSaleCommand): Observable<RegisterSaleResource> {
    const registerSaleRequest = this.assembler.toRequestFromCommand(registerSaleCommand);
    return this.http.post<RegisterSaleResponse>("api", registerSaleRequest).pipe(
      map(response => this.assembler.toResourceFromResource(response)),
      catchError(this.handleError('Failed to register sale'))
    );
  }
}
