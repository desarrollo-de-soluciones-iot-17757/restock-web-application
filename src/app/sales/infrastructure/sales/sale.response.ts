import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * SaleResource
 * Represents a single sale record.
 */
export interface SaleResource extends BaseResource {
  id: string;
  branchId: string;
  businessId: string;
  registeredByUserId: string;
  customer: CustomerResource;
  currency: string;
  saleItems: SaleItemResource[];
  saleTotal: SaleTotalResource;
  saleStatus: string;
  date: string;
}

export interface CustomerResource {
  name: string;
}

export interface SaleItemResource {
  itemId: string;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface SaleTotalResource {
  subTotal: number;
  tax: number;
  total: number;
}

/**
 * SaleResponse
 * Represents the response returned by the get sale endpoint.
 */
export interface SalesResponse extends BaseResponse, SaleResource {
  sales: SaleResource[];
}
