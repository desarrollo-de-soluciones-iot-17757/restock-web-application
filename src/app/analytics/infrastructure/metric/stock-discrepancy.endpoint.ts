import { environment } from '../../../../environments/environment';

export class StockDiscrepancyEndpoint {
  private static readonly baseUrl = environment.analyticsApi.analyticsBaseUrl;
  private static readonly path = environment.analyticsApi.customSuppliesStockDiscrepanciesPath;

  static bySupplyId(supplyId: string): string {
    return `${StockDiscrepancyEndpoint.baseUrl}${StockDiscrepancyEndpoint.path.replace('{id}', supplyId)}`;
  }
}
