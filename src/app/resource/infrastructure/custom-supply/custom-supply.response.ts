export interface CustomSupplyResponse {
  id: string;
  name: string;
  description: string;
  supplyId: string;
  supplyName: string;
  categoryName: string;
  unitPriceAmount: string;
  unitPriceCurrencyCode: string;
  unitMeasurement: string;
  minimumStock: number;
  maximumStock: number;
  pictureUrl: string;
  picturePublicId: string;
  accountId: string;
}

export type CustomSupplyListResponse = CustomSupplyResponse[];
