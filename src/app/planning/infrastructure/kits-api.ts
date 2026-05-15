import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { KitsApiEndpoint } from './kits/kits-endpoint';

/**
 * Api service for Kit operations in the catalog.
 * Handles HTTP requests and responses related to Kits.
 */
@Injectable({ providedIn: 'root' })
export class KitsApi extends BaseApi {
  private readonly kitsApiEndpoint: KitsApiEndpoint;

  /**
   * Constructor for KitsApi.
   * @param http - HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.kitsApiEndpoint = new KitsApiEndpoint(http);
  }

  /**
   * Retrieves all kits.
   * @returns An Observable that emits an array of Kit entities.
   */
  getKits() {
    return this.kitsApiEndpoint.getAll();
  }

  /**
   * Creates a new kit.
   * @param kit - The Kit entity to create.
   * @returns An Observable that emits the created Kit entity.
   */
  createKit(kit: any) {
    return this.kitsApiEndpoint.create(kit);
  }
}
