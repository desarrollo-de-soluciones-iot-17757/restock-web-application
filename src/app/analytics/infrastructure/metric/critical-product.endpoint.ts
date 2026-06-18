import { environment } from '../../../../environments/environment';

export class CriticalProductEndpoint {
  private static readonly baseUrl = environment.analyticsApi.analyticsBaseUrl;
  private static readonly path = environment.analyticsApi.accountsCriticalProductsPath;

  static byAccountId(accountId: string): string {
    return `${CriticalProductEndpoint.baseUrl}${CriticalProductEndpoint.path.replace('{accountId}', accountId)}`;
  }
}
