import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlingEnabledBaseType } from '../../../../shared/infrastructure/error-handling-enabled-base-type';
import { environment } from '../../../../../environments/environment';
import { RegisterKitCommand } from '../../../domain/model/register-kit.command';
import { Kit } from '../../../domain/model/kit.entity';
import { RegisterKitResponse } from './register-kit.response'; // ◄ Cambiamos el import al Response específico
import { RegisterKitAssembler } from './register-kit.assembler';
import { Injectable } from '@angular/core';

const kitsApiUrl = `${environment.platformProviderIamApiBaseUrl}/${environment.platformProviderKitsRegisterEndpointPath}`;

/**
 * Infrastructure endpoint adapter for specialized Kit registration HTTP operations.
 */
@Injectable({
  providedIn: 'root', // <--- ESTO ES LO QUE FALTA
})
export class RegisterKitApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Registers a new kit configuration in the remote Restock API platform.
   */
  registerKit(command: RegisterKitCommand): Observable<Kit> {
    const request = RegisterKitAssembler.toRequestFromCommand(command);
    return this.http.post<RegisterKitResponse>(kitsApiUrl, request).pipe(
      map((response) => RegisterKitAssembler.toEntityFromResponse(response)),
      catchError(this.handleError('Failed to register the new kit configuration.')),
    );
  }
}
