import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * RegisterSaleResource
 * Represents the resource returned by the register sale endpoint.
 */
export interface RegisterSaleResource extends BaseResource {
  saleId: string;
  branchId: string;
  customerName: string;
  registeredByUserId: string;
  currencyCode: string;
  currencySymbol: string;
}

/**
 * RegisterSaleResponse
 * Represents the response returned by the register sale endpoint.
 */
export interface RegisterSaleResponse extends BaseResponse, RegisterSaleResource {}
