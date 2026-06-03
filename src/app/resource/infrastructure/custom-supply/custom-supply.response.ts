export interface SupplyTemplateResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  isPerishable: boolean;
}

export interface CustomSupplyResponse {
  id: string;
  name: string;
  description: string;
  /** Present in GET /accounts/{id}/custom-supplies (nested supply object) */
  supply?: SupplyTemplateResponse;
  /** Present in POST /custom-supplies response (flat category object) */
  category?: SupplyTemplateResponse;
  unitPriceAmount: string;
  unitPriceCurrencyCode: string;
  supplyContent: number;
  unitMeasurement: string;
  pictureUrl: string;
  accountId?: string;
  isPerishable?: boolean | null;
}

export interface AccountCustomSuppliesResponse {
  accountId: string;
  totalSupplies: number;
  supplies: CustomSupplyResponse[];
}

export interface CustomSupplyRequest {
  accountId: string;
  supplyId: string;
  name: string;
  description: string;
  unitPrice: string;
  unitPriceCurrencyCode: string;
  supplyContent: number;
  unitMeasurement: string;
  minimumStock: number;
}
