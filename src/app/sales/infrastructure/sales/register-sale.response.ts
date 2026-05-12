import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

export interface RegisterSaleResource extends BaseResource {
  saleId: string;
  branchId: string;
  customerName: string;
  registeredByUserId: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface RegisterSaleResponse extends BaseResponse, RegisterSaleResource {}
