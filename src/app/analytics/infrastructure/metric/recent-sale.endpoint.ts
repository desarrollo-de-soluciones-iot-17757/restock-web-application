import { environment } from '../../../../environments/environment';

export class RecentSaleEndpoint {
  private static readonly baseUrl = environment.analyticsApi.analyticsBaseUrl;
  private static readonly path = environment.analyticsApi.accountsRecentSalesPath;

  static byAccountId(accountId: string): string {
    return `${RecentSaleEndpoint.baseUrl}${RecentSaleEndpoint.path.replace('{accountId}', accountId)}`;
  }
}
