
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdateKitCommand } from '../../../domain/model/update-kit.command';
import { Kit } from '../../../domain/model/kit.entity';
import { KitAssembler } from '../kits.assembler';
import { KitRequest } from '../kit.request';
import { KitResponse } from '../kits.response';
import { Injectable } from '@angular/core';

const kitsApiUrl = `${environment.platformProviderKitUpdateApiBaseUrl}/${environment.platformProviderKitsEndpointPath}`;;

/**
 * Infrastructure endpoint adapter for specialized Kit updating HTTP operations.
 */
@Injectable({
  providedIn: 'root', // ◄ ESTO ES LO QUE FALTA
})
export class UpdateKitApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Updates an existing kit contract setup based on its unique domain ID.
   */
  updateKit(command: UpdateKitCommand): Observable<Kit> {
    // 1. AQUÍ SE CONSTRUYE LA URL DINÁMICA:
    // Si tu comando tiene el id 'K-992', esto generará: https://tu-mock.beeceptor.com/kits/K-992
    const updateUrl = `${kitsApiUrl}/${command.id}`;

    // 2. Mapeamos los datos del comando al contrato del Request esperado
    const request: KitRequest = {
      name: command.name,
      price: command.price,
      description: command.description,
      imageUrl: command.imageUrl,
      items: command.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    // 3. Enviamos el PUT. Al empezar con "/kits/", Beeceptor lo atrapa de inmediato
    return this.http.put<KitResponse>(updateUrl, request).pipe(
      map((response) => KitAssembler.toEntityFromResponse(response)),
      catchError(this.handleError('Failed to update explicit kit setup.')),
    );
  }
}

