export interface CustomSupplyResponse {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  unitPriceAmount: string;
  unitPriceCurrencyCode: string;
  supplyContent: number;
  unitMeasurement: string;
  pictureUrl: string;
  accountId?: string;
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
  categoryName: string;
  unitPrice: string;
  supplyContent: number;
  unitMeasurement: string;
  minimumStock: number;
  pictureUrl: string;
}
