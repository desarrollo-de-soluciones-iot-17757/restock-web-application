import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Api service for Product operations.
 * Handles HTTP requests and responses related to Products.
 */
@Injectable({ providedIn: 'root' })
export class ProductsApi extends BaseApi {
  /**
   * Constructor for ProductsApi.
   * @param http - HttpClient instance for making HTTP requests.
   */
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Retrieves all products.
   * @returns An Observable that emits an array of Product entities.
   */
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.platformProviderApiBaseUrl}/products`);
  }
}
