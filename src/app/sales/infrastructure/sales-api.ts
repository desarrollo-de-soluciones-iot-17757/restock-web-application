import { Injectable } from '@angular/core';
import { RegisterSaleEndpoint } from './sales/sales-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { RegisterSaleAssembler } from './sales/register-sale.assembler';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { RegisterSaleCommand } from '../domain/model/register-sale.command';
import { Observable } from 'rxjs';
import { RegisterSaleResource } from './sales/register-sale.response';

/**
 * Api service for sales operations.
 * Handles HTTP requests and responses related to sales operations.
 */
@Injectable({ providedIn: 'root' })
export class SalesApi extends BaseApi {

  /**
   * RegisterSaleEndpoint instance for handling sale registration requests.
   * @private RegisterSaleEndpoint instance for handling sale registration requests.
   */
  private readonly registerSaleEndpoint: RegisterSaleEndpoint;

  /**
   * Constructor for SalesApi.
   * @param http - HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.registerSaleEndpoint = new RegisterSaleEndpoint(
      http,
      new RegisterSaleAssembler()
    )
  }

  /**
   * Registers a new sale using the provided RegisterSaleCommand.
   * @param registerSaleCommand - The RegisterSaleCommand containing the sale details.
   * @returns An Observable that emits the RegisterSaleResource upon successful registration.
   */
  registerSale(registerSaleCommand: RegisterSaleCommand) : Observable<RegisterSaleResource> {
    return this.registerSaleEndpoint.registerSale(registerSaleCommand);
  }
}
