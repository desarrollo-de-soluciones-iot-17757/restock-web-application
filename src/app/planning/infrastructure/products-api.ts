import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsApiEndpoint {
  private readonly http = inject(HttpClient);
  // Reemplaza esto por tu URL real de Beeceptor o usa tu environment configurado
  private readonly baseUrl = 'https://restock-api-planning-kits.free.beeceptor.com/products';

  /**
   * Consume el JSON en crudo desde el endpoint de Beeceptor
   */
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
