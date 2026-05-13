import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * SaleResource
 * Represents a single sale record.
 */
export interface SaleResource extends BaseResource {
  businessId: string;
  branchId: string;
  registeredByUserId: string;
  customerName: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  saleDate: string;
}

/**
 * SaleResponse
 * Represents the response returned by the get sale endpoint.
 */
export interface SalesResponse extends BaseResponse, SaleResource {
  sales: SaleResource[];
}
