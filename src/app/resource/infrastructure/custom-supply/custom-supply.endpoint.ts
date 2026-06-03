import { environment } from '../../../../environments/environment';

export const CUSTOM_SUPPLY_ENDPOINT = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderCustomSuppliesEndpointPath}`;
export const ACCOUNT_CUSTOM_SUPPLIES_ENDPOINT = (accountId: string) =>
  `${environment.platformProviderApiBaseUrl}/accounts/${accountId}/${environment.platformProviderCustomSuppliesEndpointPath}`;
